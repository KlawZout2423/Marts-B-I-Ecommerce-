"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Heart, 
  Eye 
} from "lucide-react";
import { Product } from "@/data/products";
import styles from "./Dashboard.module.css";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={styles.dashboard}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>Store Overview</h1>
        <p style={{ color: '#64748b' }}>Welcome back, here's what's happening with MARTS B&I today.</p>
      </header>

      {/* 📊 Stat Cards */}
      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.iconWrapper} ${styles.blue}`}><Package size={20} /></div>
            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} /> +4.2%
            </span>
          </div>
          <div className={styles.statValue}>{products.length}</div>
          <div className={styles.statLabel}>Total Products</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.iconWrapper} ${styles.purple}`}><Heart size={20} /></div>
            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} /> +12%
            </span>
          </div>
          <div className={styles.statValue}>432</div>
          <div className={styles.statLabel}>Total Favorites</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.iconWrapper} ${styles.green}`}><ShoppingCart size={20} /></div>
            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} /> +8.1%
            </span>
          </div>
          <div className={styles.statValue}>128</div>
          <div className={styles.statLabel}>Total Orders</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.iconWrapper} ${styles.orange}`}><TrendingUp size={20} /></div>
            <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} style={{ transform: 'rotate(90deg)' }} /> -2.4%
            </span>
          </div>
          <div className={styles.statValue}>$12,430</div>
          <div className={styles.statLabel}>Monthly Revenue</div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* 🛍️ Recent Products */}
        <section className={styles.section}>
          <h2>Recent Inventory</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Badge</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.productInfo}>
                      <img src={p.image} alt="" className={styles.productImage} />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>${p.price}</td>
                  <td>
                    {p.badge && (
                      <span className={`${styles.badge} ${p.badge === 'New' ? styles.badgeNew : styles.badgeSale}`}>
                        {p.badge}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 💓 Trending Items */}
        <section className={styles.section}>
          <h2>Top "Loved" Items</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {products.slice(0, 3).map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                <img src={p.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{p.name}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{p.reviewCount} Favorites</p>
                </div>
                <Heart size={16} fill="#ef4444" color="#ef4444" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
