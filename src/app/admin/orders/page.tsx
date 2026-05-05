"use client";

import { Search, Eye, Download } from "lucide-react";
import styles from "../AdminPages.module.css";

export default function OrdersPage() {
  const orders = [
    { id: "#ORD-8821", date: "Oct 24, 2024", customer: "Sarah Jenkins", total: "$398.00", items: 1, status: "Pending" },
    { id: "#ORD-8820", date: "Oct 23, 2024", customer: "Michael Chen", total: "$1,098.00", items: 2, status: "Shipped" },
    { id: "#ORD-8819", date: "Oct 21, 2024", customer: "Amanda Waller", total: "$329.00", items: 1, status: "Delivered" },
    { id: "#ORD-8818", date: "Oct 20, 2024", customer: "David Kim", total: "$549.00", items: 1, status: "Delivered" },
    { id: "#ORD-8817", date: "Oct 19, 2024", customer: "Elena Rodriguez", total: "$149.50", items: 3, status: "Refunded" },
  ];

  return (
    <div>
      <header className={styles.pageHeader}>
        <div>
          <h1>Orders</h1>
          <p>Process customer orders, handle fulfillments, and manage returns.</p>
        </div>
        <button className={styles.primaryBtn} style={{ background: 'white', color: '#0f172a', border: '1px solid #cbd5e1' }}>
          <Download size={18} /> Export CSV
        </button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <div className={styles.searchBar}>
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Search by order ID or customer name..." />
          </div>
          <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <option>All Orders</option>
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: '#0ea5e9' }}>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td style={{ fontWeight: 600 }}>{order.total}</td>
                <td>
                  <span className={`${styles.badge} ${
                    order.status === 'Delivered' ? styles.badgeSuccess : 
                    order.status === 'Pending' ? styles.badgeWarning : 
                    order.status === 'Shipped' ? styles.badgeNeutral :
                    styles.badgeDanger
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className={styles.iconBtn} title="View Details"><Eye size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
