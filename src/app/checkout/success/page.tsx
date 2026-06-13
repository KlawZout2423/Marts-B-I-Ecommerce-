'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  ShoppingBag, 
  ArrowRight, 
  MapPin, 
  Compass, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  FileText,
  Loader2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './success.module.css';

function SuccessClient() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Always clear cart on successful arrival
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!orderId) {
      setFetching(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          throw new Error("Order not found");
        }
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        console.error("Error fetching order details:", err);
        setError(err.message || "Failed to fetch order");
      } finally {
        setFetching(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Parser to split GPS block out of address
  const parseGPS = (addressStr: string) => {
    if (!addressStr) return null;
    const match = addressStr.match(/\(GPS:\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\)/);
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2])
      };
    }
    return null;
  };

  const getCleanAddress = (addressStr: string) => {
    if (!addressStr) return "";
    return addressStr.replace(/\s*\(GPS:\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\)/, "");
  };

  if (fetching) {
    return (
      <>
        <Navbar />
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingInner}>
            <Loader2 className={styles.spinner} size={44} />
            <p>Compiling your invoice & shipping details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Fallback if order details could not be resolved
  if (error || !order) {
    return (
      <>
        <Navbar />
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.card}>
              <div className={styles.iconWrapper}>
                <CheckCircle size={80} strokeWidth={1.5} className={styles.icon} />
              </div>
              
              <h1 className={styles.title}>Order Confirmed!</h1>
              <p className={styles.subtitle}>
                Thank you for your purchase. We've received your order and are processing it now.
              </p>

              <div className={styles.details}>
                <p>You will receive an email confirmation shortly with your order details and tracking information.</p>
              </div>

              <div className={styles.actions}>
                <Link href="/shop" className={styles.primaryBtn}>
                  <ShoppingBag size={18} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const gpsCoords = parseGPS(order.shippingAddress);
  const cleanAddress = getCleanAddress(order.shippingAddress);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.receiptGrid}>
          {/* Main Success Greeting & Receipt */}
          <div className={styles.mainContent}>
            <div className={styles.successHeader}>
              <div className={styles.circleCheck}>
                <CheckCircle size={56} className={styles.checkIcon} />
              </div>
              <div className={styles.headerText}>
                <span className={styles.successLabel}>PAYMENT RECEIVED SUCCESSFUL</span>
                <h1 className={styles.title}>Order #{order.orderNumber}</h1>
                <p className={styles.subtitle}>Placed on {formattedDate}</p>
              </div>
            </div>

            {/* Order Items Invoice */}
            <div className={styles.invoiceCard}>
              <div className={styles.invoiceHeader}>
                <span className={styles.invoiceTitle}>
                  <FileText size={18} /> Items Summary
                </span>
                <span className={styles.invoiceStatus}>PAID</span>
              </div>
              <div className={styles.itemsList}>
                {order.items && order.items.map((item: any) => (
                  <div key={item.id} className={styles.itemRow}>
                    {item.image && (
                      <img src={item.image} alt={item.name} className={styles.itemThumb} />
                    )}
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemMeta}>Qty: {item.quantity} × GHS {parseFloat(item.price).toFixed(2)}</span>
                    </div>
                    <span className={styles.itemTotal}>GHS {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.invoiceFooter}>
                <div className={styles.footerRow}>
                  <span>Subtotal</span>
                  <span>GHS {parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
                <div className={styles.footerRow}>
                  <span>Delivery fee</span>
                  <span className={styles.freeBadge}>FREE</span>
                </div>
                <div className={`${styles.footerRow} ${styles.grandTotal}`}>
                  <span>Total Amount Paid</span>
                  <span>GHS {parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details info */}
            <div className={styles.customerCard}>
              <h2 className={styles.cardTitle}>Customer Information</h2>
              <div className={styles.customerInfoGrid}>
                <div className={styles.infoBlock}>
                  <User size={16} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Name</span>
                    <span className={styles.infoValue}>{order.customerName}</span>
                  </div>
                </div>
                <div className={styles.infoBlock}>
                  <Mail size={16} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{order.customerEmail}</span>
                  </div>
                </div>
                {order.customerPhone && (
                  <div className={styles.infoBlock}>
                    <Phone size={16} className={styles.infoIcon} />
                    <div>
                      <span className={styles.infoLabel}>Phone</span>
                      <span className={styles.infoValue}>{order.customerPhone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.receiptActions}>
              <Link href="/shop" className={styles.primaryBtn}>
                <ShoppingBag size={18} />
                Continue Shopping
              </Link>
              <Link href="/account/orders" className={styles.secondaryBtn}>
                View Order History
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Sidebar - Delivery Point & Satellite Target Pin */}
          <div className={styles.sidebar}>
            {/* GPS Lock Card */}
            {gpsCoords ? (
              <div className={styles.targetCard}>
                <h3 className={styles.targetTitle}>
                  <Compass size={18} /> Verified Drop-off
                </h3>
                <div className={styles.mapGridWrapper}>
                  {/* Glowing dynamic radar map visual */}
                  <div className={styles.mapRadar}>
                    <div className={styles.radarRingPulse} />
                    <div className={styles.radarRingPulseDelayed} />
                    <div className={styles.mapTargetPin}>
                      <MapPin size={32} className={styles.pulsePin} />
                      <div className={styles.pinShadow} />
                    </div>
                  </div>
                </div>
                
                <div className={styles.coordinatesWrapper}>
                  <div className={styles.coordBox}>
                    <span className={styles.coordLabel}>LATITUDE</span>
                    <span className={styles.coordValue}>{gpsCoords.lat.toFixed(6)}</span>
                  </div>
                  <div className={styles.coordBox}>
                    <span className={styles.coordLabel}>LONGITUDE</span>
                    <span className={styles.coordValue}>{gpsCoords.lng.toFixed(6)}</span>
                  </div>
                </div>

                <div className={styles.addressSection}>
                  <span className={styles.addressLabel}>DELIVERY ADDRESS</span>
                  <p className={styles.addressText}>{cleanAddress}</p>
                </div>
                
                <div className={styles.geoStatusBadge}>
                  <span className={styles.statusDot} />
                  GPS LOCK ACTIVE FOR COURIER
                </div>
              </div>
            ) : (
              <div className={styles.targetCard}>
                <h3 className={styles.targetTitle}>
                  <MapPin size={18} /> Delivery Address
                </h3>
                <div className={styles.addressSection} style={{ marginTop: '0' }}>
                  <p className={styles.addressText} style={{ fontSize: '1rem', color: '#1e293b' }}>{cleanAddress}</p>
                </div>
                <div className={styles.geoStatusBadge} style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#d97706', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                  <span className={styles.statusDot} style={{ background: '#f59e0b' }} />
                  MANUAL ADDRESS (NO GPS COORDINATES)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem',
        color: '#64748b'
      }}>
        <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={40} />
        <p style={{ fontWeight: 600 }}>Loading Receipt Details...</p>
      </div>
    }>
      <SuccessClient />
    </Suspense>
  );
}
