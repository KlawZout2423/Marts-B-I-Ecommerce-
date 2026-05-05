"use client";

import React from "react";
import styles from "../account.module.css";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";

export default function OrdersPage() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>Order History</h3>
      </div>
      
      <div className={styles.ordersTableContainer}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Mock Data */}
            <tr>
              <td><span className={styles.orderId}>#MRT-8492</span></td>
              <td>Oct 24, 2023</td>
              <td><span className={`${styles.statusPill} ${styles.delivered}`}>Delivered</span></td>
              <td>$299.00</td>
              <td><Link href="/account/orders/8492" className={styles.tableLink}>Details</Link></td>
            </tr>
            <tr>
              <td><span className={styles.orderId}>#MRT-7210</span></td>
              <td>Oct 12, 2023</td>
              <td><span className={`${styles.statusPill} ${styles.shipped}`}>In Transit</span></td>
              <td>$1,150.00</td>
              <td><Link href="/account/orders/7210" className={styles.tableLink}>Details</Link></td>
            </tr>
            <tr>
              <td><span className={styles.orderId}>#MRT-6844</span></td>
              <td>Sep 28, 2023</td>
              <td><span className={`${styles.statusPill} ${styles.delivered}`}>Delivered</span></td>
              <td>$89.50</td>
              <td><Link href="/account/orders/6844" className={styles.tableLink}>Details</Link></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.emptyOrdersState} style={{ display: 'none' }}>
        <div className={styles.emptyIcon}>
          <ShoppingBag size={48} />
        </div>
        <p>You haven't placed any orders yet.</p>
        <Link href="/shop" className={styles.shopNowBtn}>Start Shopping</Link>
      </div>
    </section>
  );
}
