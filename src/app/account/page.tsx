"use client";

import React from "react";
import styles from "./account.module.css";
import Link from "next/link";
import { 
  Package, 
  CreditCard,
  ChevronRight,
  Clock
} from "lucide-react";

export default function AccountPage() {
  return (
    <>
      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}>
            <Package size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>12</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}>
            <Clock size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>2</span>
            <span className={styles.statLabel}>Pending Deliveries</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.gold}`}>
            <CreditCard size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>$4,250</span>
            <span className={styles.statLabel}>Total Spent</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Recent Orders</h3>
          <Link href="/account/orders" className={styles.viewAll}>View All <ChevronRight size={16} /></Link>
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
      </section>

      {/* Profile Summary */}
      <div className={styles.bottomGrid}>
        <div className={styles.infoCard}>
          <h3>Primary Address</h3>
          <div className={styles.addressBox}>
            <p className={styles.addressName}>Eugene J.</p>
            <p>123 Luxury Lane, Business District</p>
            <p>Lagos, Nigeria</p>
            <Link href="/account/addresses" className={styles.editLink}>Edit Address</Link>
          </div>
        </div>
        
        <div className={styles.infoCard}>
          <h3>Account Security</h3>
          <div className={styles.securityBox}>
            <div className={styles.securityItem}>
              <span>Email Verification</span>
              <span className={styles.verified}>Verified</span>
            </div>
            <div className={styles.securityItem}>
              <span>Two-Factor Auth</span>
              <span className={styles.unverified}>Disabled</span>
            </div>
            <Link href="/account/settings" className={styles.editLink}>Security Settings</Link>
          </div>
        </div>
      </div>
    </>
  );
}
