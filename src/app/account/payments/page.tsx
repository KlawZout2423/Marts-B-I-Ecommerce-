import React from "react";
import styles from "./payments.module.css";
import { CreditCard, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentsPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Payment Methods</h2>
        <button className={styles.addBtn}>
          <Plus size={18} /> Add New Card
        </button>
      </div>

      {/* Empty state – replace with real data when backend added */}
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <CreditCard size={48} strokeWidth={1.5} />
        </div>
        <h3>No payment methods saved yet</h3>
        <p>Add a card to enjoy fast checkout.</p>
        <Link href="/shop" className={styles.shopLink}>Browse Products</Link>
      </div>
    </div>
  );
}
