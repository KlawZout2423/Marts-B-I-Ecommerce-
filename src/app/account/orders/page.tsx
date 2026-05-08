"use client";

import React, { useState } from "react";
import useSWR from "swr";
import styles from "../account.module.css";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

// Types
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  items?: OrderItem[];
}

// Status pill classes
const STATUS_CLASSES: Record<string, string> = {
  delivered: `${styles.statusPill} ${styles.delivered}`,
  shipped: `${styles.statusPill} ${styles.shipped}`,
  pending: `${styles.statusPill} ${styles.pending}`,
  paid: `${styles.statusPill} ${styles.shipped}`, // Reuse blue/teal style for Paid
  cancelled: `${styles.statusPill} ${styles.cancelled}`,
};

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [sortKey, setSortKey] = useState<keyof Order>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  const { data, error, isLoading } = useSWR<Order[]>('/api/orders', fetcher, {
    refreshInterval: 3000,
  });
  const orders = data ?? [];

  const handleSort = (key: keyof Order) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const aVal = a[sortKey] as any;
    const bVal = b[sortKey] as any;
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedOrders = sortedOrders.slice(startIdx, startIdx + rowsPerPage);
  const totalPages = Math.ceil(orders.length / rowsPerPage);

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading orders…</div>;
  }

  if (orders.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.emptyOrdersState}>
          <div className={styles.emptyIcon}>
            <ShoppingBag size={48} />
          </div>
          <p>You haven't placed any orders yet.</p>
          <Link href="/shop" className={styles.shopNowBtn}>Start Shopping</Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>Order History</h3>
      </div>

      <div className={styles.ordersTableContainer}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th onClick={() => handleSort('orderNumber')} style={{ cursor: 'pointer' }}>Order ID</th>
              <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>Date</th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status</th>
              <th onClick={() => handleSort('totalAmount')} style={{ cursor: 'pointer' }}>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id}>
                <td><span className={styles.orderId}>{order.orderNumber}</span></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td><span className={STATUS_CLASSES[order.status.toLowerCase()] || styles.statusPill}>{order.status}</span></td>
                <td>{`$${parseFloat(String(order.totalAmount)).toFixed(2)}`}</td>
                <td><Link href={`/account/orders/${order.id}`} className={styles.tableLink}>Details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination} style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className={styles.pageBtn}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={styles.pageBtn}>Next</button>
      </div>
    </section>
  );
}
