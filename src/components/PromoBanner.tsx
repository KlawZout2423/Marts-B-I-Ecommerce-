"use client";

import styles from "./PromoBanner.module.css";

export default function PromoBanner() {
  return (
    <div className={styles.banner}>
      <div className="container">
        <span>Free Shipping on Orders Over $50</span>
      </div>
    </div>
  );
}
