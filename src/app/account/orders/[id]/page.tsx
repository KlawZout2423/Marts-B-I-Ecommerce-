"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./order-detail.module.css";
import { ArrowLeft, Package, MapPin, Clock } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function statusClass(status: string) {
  switch (status?.toLowerCase()) {
    case "delivered":  return styles.delivered;
    case "shipped":    return styles.shipped;
    case "pending":    return styles.pending;
    case "cancelled":  return styles.cancelled;
    default:           return styles.pending;
  }
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useSWR(
    id ? `/api/orders/${id}` : null,
    fetcher
  );

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading order details…</p>
      </div>
    );
  }

  if (error || !order || order.error) {
    return (
      <div className={styles.errorState}>
        <Package size={48} strokeWidth={1.5} />
        <h3>Order not found</h3>
        <p>We couldn&apos;t find this order. It may have been removed.</p>
        <Link href="/account/orders" className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Orders
        </Link>
      </div>
    );
  }

  const items: any[] = order.items || [];
  const total = parseFloat(order.totalAmount || 0);
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className={styles.wrapper}>
      {/* Back nav */}
      <Link href="/account/orders" className={styles.back}>
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      {/* Order header */}
      <div className={styles.headerCard}>
        <div className={styles.headerLeft}>
          <h2 className={styles.orderNum}>#{order.orderNumber}</h2>
          <p className={styles.orderDate}><Clock size={14} /> Placed on {date}</p>
        </div>
        <span className={`${styles.statusBadge} ${statusClass(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className={styles.grid}>
        {/* Items */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}><Package size={18} /> Order Items</h3>
          <div className={styles.itemsList}>
            {items.length === 0 ? (
              <p className={styles.noItems}>No items found for this order.</p>
            ) : items.map((item: any, i: number) => (
              <div key={item.id || i} className={styles.item}>
                {item.image && (
                  <img src={item.image} alt={item.name} className={styles.itemImg} />
                )}
                {!item.image && (
                  <div className={styles.itemImgPlaceholder}>
                    <Package size={20} />
                  </div>
                )}
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemMeta}>Qty: {item.quantity} &bull; ${parseFloat(item.price).toFixed(2)} each</p>
                </div>
                <p className={styles.itemTotal}>
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span className={styles.free}>Free</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Delivery info */}
        <section className={styles.card}>
          <h3 className={styles.cardTitle}><MapPin size={18} /> Delivery Information</h3>
          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Customer</p>
            <p className={styles.infoValue}>{order.customerName}</p>
          </div>
          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Email</p>
            <p className={styles.infoValue}>{order.customerEmail}</p>
          </div>
          {order.customerPhone && (
            <div className={styles.infoBlock}>
              <p className={styles.infoLabel}>Phone</p>
              <p className={styles.infoValue}>{order.customerPhone}</p>
            </div>
          )}
          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Shipping Address</p>
            <p className={styles.infoValue}>{order.shippingAddress}</p>
          </div>
          <div className={styles.infoBlock}>
            <p className={styles.infoLabel}>Order Status</p>
            <span className={`${styles.statusBadge} ${statusClass(order.status)}`}>
              {order.status}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
