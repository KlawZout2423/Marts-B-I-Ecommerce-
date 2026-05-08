'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import CheckoutGate from '@/components/CheckoutGate';
import styles from './checkout.module.css';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';
import { authClient } from "@/lib/auth-client";
import { useCart } from '@/context/CartContext';
import { usePaystackPayment } from 'react-paystack';

export default function CheckoutClient() {
  const { data: session, isPending: loading } = authClient.useSession();
  const [isGuest, setIsGuest] = useState(false);
  const { cart, totalPrice, clearCart } = useCart();
  const { settings } = useStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });

  const [isOrdering, setIsOrdering] = useState(false);

  // Paystack Configuration
  const config = {
    reference: (new Date()).getTime().toString(),
    email: formData.email || "guest@example.com",
    amount: Math.round(totalPrice * 100), 
    currency: settings.currency || "GHS",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: `${formData.firstName} ${formData.lastName}`
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: formData.phone
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  useEffect(() => {
    if (session?.user) {
      const [first, ...last] = (session.user.name || "").split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: first || "",
        lastName: last.join(" ") || "",
        email: session.user.email || ""
      }));
    }
  }, [session]);

  const onSuccess = async (response: any) => {
    // response contains { reference, message, status, trans, transaction }
    toast.loading("Verifying payment...", { id: "verify-payment" });
    
    try {
      const verifyRes = await fetch(`/api/paystack/verify/${response.reference}`);
      const verifyData = await verifyRes.json();

      if (verifyRes.ok) {
        toast.success("Payment Verified!", { id: "verify-payment" });
        clearCart();
        router.push("/checkout/success");
      } else {
        throw new Error(verifyData.error || "Verification failed");
      }
    } catch (err: any) {
      toast.error(`Verification Error: ${err.message}`, { id: "verify-payment" });
      setIsOrdering(false);
    }
  };

  const onClose = () => {
    toast.info("Payment window closed.");
    setIsOrdering(false);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config.publicKey || config.publicKey === "pk_test_your_actual_public_key_here") {
      toast.error("Paystack Public Key is missing or invalid in .env");
      return;
    }

    setIsOrdering(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cart,
          totalPrice
        })
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Order failed");

      // 2. Trigger Paystack Payment
      // Note: we can't easily update reference in config with the 'react-paystack' hook after init,
      // so we use the direct PaystackPop global for maximum control over the reference.
      const paymentConfig = {
        ...config,
        reference: `${orderData.orderNumber}_${Date.now()}`,
        metadata: {
          ...config.metadata,
          orderNumber: orderData.orderNumber,
          orderId: orderData.orderId
        }
      };

      // @ts-ignore
      const handler = window.PaystackPop.setup({
        ...paymentConfig,
        callback: onSuccess,
        onClose: onClose
      });
      handler.openIframe();

    } catch (err: any) {
      toast.error(err.message || "Failed to process order");
      setIsOrdering(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session && !isGuest) {
    return <CheckoutGate onContinueAsGuest={() => setIsGuest(true)} />;
  }

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h1>Your cart is empty</h1>
        <p>Add some premium items to your cart before checking out.</p>
        <Link href="/shop" className={styles.continueButton}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.checkoutGrid}>
        <div className={styles.formSection}>
          <h1 className={styles.title}>Checkout</h1>
          {session ? (
            <div className={styles.welcomeBack}>
              Welcome back, {session.user.name}! We've pre-filled your details.
            </div>
          ) : (
            <div className={styles.guestNotice}>
              Checking out as Guest. <Link href="/login">Sign in</Link> for a faster experience.
            </div>
          )}
          
          <form className={styles.form} onSubmit={handleCheckout}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Shipping Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    required 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    required 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    required 
                    placeholder="+233..." 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label htmlFor="address">Address</label>
                  <input 
                    type="text" 
                    id="address" 
                    required 
                    placeholder="123 Premium St" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    required 
                    placeholder="Accra" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="zipCode">Zip Code</label>
                  <input 
                    type="text" 
                    id="zipCode" 
                    required 
                    placeholder="00233" 
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={isOrdering}
            >
              {isOrdering ? "Processing..." : `Pay Now - ${settings.currencySymbol}${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.cartItems}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQty}>Qty: {item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>{settings.currencySymbol}{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>{settings.currencySymbol}{totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>{settings.currencySymbol}{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
