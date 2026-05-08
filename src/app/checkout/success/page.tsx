'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './success.module.css';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Ensure cart is cleared on successful arrival
    clearCart();
  }, [clearCart]);

  return (
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
            <Link href="/account/orders" className={styles.secondaryBtn}>
              View My Orders
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
