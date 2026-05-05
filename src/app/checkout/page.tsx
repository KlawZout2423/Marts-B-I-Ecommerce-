'use client';

import React, { useState, useEffect } from 'react';
import CheckoutGate from '@/components/CheckoutGate';
import styles from './checkout.module.css';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

import { usePaystackPayment } from "react-paystack";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { data: session, isPending: loading } = authClient.useSession();
  const [isGuest, setIsGuest] = useState(false);
  const { cart, totalPrice } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: ""
  });

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

  const config = {
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: Math.round(totalPrice * 100), // Paystack expects amount in kobo (NGN) or cents (USD)
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    console.log("Payment successful:", reference);
    // Here you would normally create an order in your DB
    router.push("/account/orders?success=true");
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.publicKey || config.publicKey.includes("your_actual_public_key")) {
      alert("Please configure your Paystack Public Key in the .env file.");
      return;
    }
    initializePayment({onSuccess, onClose});
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
                    placeholder="New York" 
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
                    placeholder="10001" 
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <button type="submit" className={styles.submitButton}>
              Pay with Paystack - ${totalPrice.toFixed(2)}
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
                  <span className={styles.itemPrice}>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
