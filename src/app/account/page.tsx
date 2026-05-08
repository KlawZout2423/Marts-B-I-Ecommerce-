"use client";

import React from "react";
import useSWR from "swr";
import styles from "./account.module.css";
import Link from "next/link";
import { Package, CreditCard, ChevronRight, Clock } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function getStatusClass(status: string) {
  switch (status?.toLowerCase()) {
    case "delivered": return styles.delivered;
    case "shipped": return styles.shipped;
    case "pending": return styles.pending;
    case "cancelled": return styles.cancelled;
    default: return styles.pending;
  }
}

export default function AccountPage() {
  const { data: orders = [], isLoading } = useSWR("/api/orders", fetcher, { refreshInterval: 5000 });

  const totalOrders = Array.isArray(orders) ? orders.length : 0;
  const pendingDeliveries = Array.isArray(orders) ? orders.filter((o: any) => o.status?.toLowerCase() !== "delivered").length : 0;
  const totalSpent = Array.isArray(orders) ? orders.reduce((sum: number, o: any) => sum + (parseFloat(o.totalAmount) || 0), 0) : 0;
  const recentOrders = Array.isArray(orders) ? orders.slice(0, 5) : [];

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading dashboard…</div>;
  }

  return (
    <>
      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}>
            <Package size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{totalOrders}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}>
            <Clock size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{pendingDeliveries}</span>
            <span className={styles.statLabel}>Pending Deliveries</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.gold}`}>
            <CreditCard size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>${totalSpent.toFixed(2)}</span>
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
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", opacity: 0.6 }}>
                    No orders yet. Start shopping!
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td data-label="Order ID"><span className={styles.orderId}>#{order.orderNumber}</span></td>
                    <td data-label="Date">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td data-label="Status"><span className={`${styles.statusPill} ${getStatusClass(order.status)}`}>{order.status}</span></td>
                    <td data-label="Total">${parseFloat(order.totalAmount).toFixed(2)}</td>
                    <td data-label="Action"><Link href={`/account/orders/${order.id}`} className={styles.tableLink}>Details</Link></td>
                  </tr>
                ))
              )}
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
