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
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

// Dynamic script loader for Paystack to avoid React 19 SSR issues
const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (window.PaystackPop) {
      // @ts-ignore
      resolve(window.PaystackPop);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    // @ts-ignore
    script.onload = () => resolve(window.PaystackPop);
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.body.appendChild(script);
  });
};

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
    zipCode: "",
    latitude: "",
    longitude: ""
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  const handlePickGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    toast.loading("Retrieving GPS coordinates...", { id: "gps-fetch" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }));

        toast.loading("Coordinates locked. Resolving address...", { id: "gps-fetch" });

        try {
          // OpenStreetMap Nominatim reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            const addressDetails = data.address || {};
            
            // Build a human-friendly road address
            const road = addressDetails.road || addressDetails.suburb || addressDetails.neighbourhood || "";
            const houseNumber = addressDetails.house_number || "";
            const streetAddress = [road, houseNumber].filter(Boolean).join(" ");
            
            const cityVal = addressDetails.city || addressDetails.town || addressDetails.village || addressDetails.state_district || "";
            const postCode = addressDetails.postcode || "";

            setFormData(prev => ({
              ...prev,
              address: streetAddress || data.display_name?.split(',').slice(0, 2).join(',') || prev.address,
              city: cityVal || prev.city,
              zipCode: postCode || prev.zipCode
            }));
            
            toast.success("GPS Location & Address locked in!", { id: "gps-fetch" });
          } else {
            toast.success(`GPS coordinates secured: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`, { id: "gps-fetch" });
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          toast.success(`GPS coordinates secured: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`, { id: "gps-fetch" });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMsg = "Could not access location. Please check browser permissions.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location access denied. Please enable permission to use GPS.";
        }
        toast.error(errorMsg, { id: "gps-fetch" });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

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
      const paymentConfig = {
        ...config,
        reference: `${orderData.orderNumber}_${Date.now()}`,
        metadata: {
          ...config.metadata,
          orderNumber: orderData.orderNumber,
          orderId: orderData.orderId
        }
      };

      // Ensure script is loaded before calling setup
      await loadPaystackScript();

      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: paymentConfig.publicKey,
        email: paymentConfig.email,
        amount: paymentConfig.amount,
        currency: paymentConfig.currency,
        ref: paymentConfig.reference,
        metadata: paymentConfig.metadata,
        callback: function(response: any) {
          onSuccess(response);
        },
        onClose: function() {
          onClose();
        }
      });
      handler.openIframe();

    } catch (err: any) {
      toast.error(err.message || "Failed to process order");
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingPulse}>
            <Loader2 className={styles.spinnerIcon} size={40} />
            <p>Verifying session details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!session && !isGuest) {
    return (
      <>
        <Navbar />
        <main className={styles.gateWrapper}>
          <CheckoutGate onContinueAsGuest={() => setIsGuest(true)} />
        </main>
        <Footer />
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <main className={styles.emptyCartWrapper}>
          <div className={styles.emptyCart}>
            <h1>Your cart is empty</h1>
            <p>Add some premium items to your cart before checking out.</p>
            <Link href="/shop" className={styles.continueButton}>Continue Shopping</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.pageWrapper}>
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
                  
                  {/* Dynamic GPS Pinpoint Trigger */}
                  <div className={styles.gpsContainer}>
                    <div className={styles.gpsHeader}>
                      <span className={styles.gpsTitle}>
                        <MapPin size={16} className={styles.gpsIcon} /> Precise Drop-off Pinpoint
                      </span>
                      <button
                        type="button"
                        onClick={handlePickGPS}
                        disabled={isLocating}
                        className={styles.gpsTriggerBtn}
                      >
                        {isLocating ? (
                          <>
                            <Loader2 size={14} className={styles.spin} />
                            <span>Locating...</span>
                          </>
                        ) : (
                          <>
                            <Navigation size={14} />
                            <span>Pick from GPS</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className={styles.gpsDescription}>
                      Lock your exact coordinates for a seamless local drop-off, or type them manually.
                    </p>
                    
                    <div className={styles.coordinatesGrid}>
                      <div className={styles.coordinateInputWrapper}>
                        <label htmlFor="latitude">Latitude</label>
                        <input
                          type="number"
                          step="any"
                          id="latitude"
                          placeholder="e.g. 5.6037"
                          value={formData.latitude}
                          onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                        />
                      </div>
                      <div className={styles.coordinateInputWrapper}>
                        <label htmlFor="longitude">Longitude</label>
                        <input
                          type="number"
                          step="any"
                          id="longitude"
                          placeholder="e.g. -0.1870"
                          value={formData.longitude}
                          onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

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
                      <label htmlFor="address">Address / Delivery Point</label>
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
                  {isOrdering ? "Processing Order..." : `Pay Now - ${settings.currencySymbol}${totalPrice.toFixed(2)}`}
                </button>
              </form>
            </div>

            <div className={styles.summarySection}>
              {/* Geolocation Radar System */}
              <div className={styles.gpsTargetCard}>
                <h3 className={styles.targetCardTitle}>
                  <Navigation size={16} className={styles.navigationIcon} />
                  GPS Delivery Tracking
                </h3>
                <div className={styles.radarOuter}>
                  <div className={`${styles.radarGrid} ${formData.latitude && formData.longitude ? styles.radarGridLocked : ""}`}>
                    <div className={styles.radarSweep} />
                    <div className={styles.radarTargetPin}>
                      <div className={styles.radarTargetPulse} />
                      <MapPin size={24} className={formData.latitude && formData.longitude ? styles.lockedPin : styles.searchingPin} />
                    </div>
                  </div>
                </div>
                <div className={styles.targetDetails}>
                  <div className={styles.targetRow}>
                    <span className={styles.targetLabel}>STATUS</span>
                    <span className={`${styles.targetVal} ${formData.latitude && formData.longitude ? styles.statusLocked : styles.statusIdle}`}>
                      {formData.latitude && formData.longitude ? "PIN SECURED" : "PENDING GPS LOCK"}
                    </span>
                  </div>
                  <div className={styles.targetRow}>
                    <span className={styles.targetLabel}>LATITUDE</span>
                    <span className={styles.targetVal}>{formData.latitude || "—"}</span>
                  </div>
                  <div className={styles.targetRow}>
                    <span className={styles.targetLabel}>LONGITUDE</span>
                    <span className={styles.targetVal}>{formData.longitude || "—"}</span>
                  </div>
                </div>
              </div>

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
      </main>
      <Footer />
    </>
  );
}
