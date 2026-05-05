"use client";

import { DollarSign, Users, ShoppingBag, TrendingUp, Download } from "lucide-react";
import styles from "../AdminPages.module.css";

export default function AnalyticsPage() {
  return (
    <div>
      <header className={styles.pageHeader}>
        <div>
          <h1>Analytics Overview</h1>
          <p>Track your store's performance, revenue, and customer engagement.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Year</option>
          </select>
          <button className={styles.primaryBtn} style={{ background: 'white', color: '#0f172a', border: '1px solid #cbd5e1' }}>
            <Download size={18} /> Export Report
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTitle}><DollarSign size={18} color="#0ea5e9" /> Total Revenue</div>
          <div className={styles.kpiValue}>$24,592.00</div>
          <div className={styles.kpiTrend}><TrendingUp size={14} /> +12.5% from last month</div>
        </div>
        
        <div className={styles.kpiCard}>
          <div className={styles.kpiTitle}><ShoppingBag size={18} color="#0ea5e9" /> Total Orders</div>
          <div className={styles.kpiValue}>142</div>
          <div className={styles.kpiTrend}><TrendingUp size={14} /> +8.2% from last month</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTitle}><Users size={18} color="#0ea5e9" /> Unique Visitors</div>
          <div className={styles.kpiValue}>8,405</div>
          <div className={styles.kpiTrend}><TrendingUp size={14} /> +22.4% from last month</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTitle}><TrendingUp size={18} color="#0ea5e9" /> Conversion Rate</div>
          <div className={styles.kpiValue}>2.4%</div>
          <div className={styles.kpiTrend} style={{ color: '#64748b' }}>No change</div>
        </div>
      </div>

      <div className={styles.tableCard} style={{ marginTop: '32px' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Top Selling Products</h2>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Units Sold</th>
              <th>Revenue Generated</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>Sony WH-1000XM5</td>
              <td>42</td>
              <td>$16,716.00</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Apple AirPods Max</td>
              <td>18</td>
              <td>$9,882.00</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Bose QuietComfort 45</td>
              <td>24</td>
              <td>$7,896.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
