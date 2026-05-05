"use client";

import { Save } from "lucide-react";
import styles from "../AdminPages.module.css";

export default function SettingsPage() {
  return (
    <div>
      <header className={styles.pageHeader}>
        <div>
          <h1>Store Settings</h1>
          <p>Configure your store details, regional settings, and notifications.</p>
        </div>
        <button className={styles.primaryBtn}>
          <Save size={18} /> Save Settings
        </button>
      </header>

      <section className={styles.formSection}>
        <h2>Store Details</h2>
        <p>The basic information used publicly on your storefront and emails.</p>
        
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Store Name</label>
            <input type="text" defaultValue="MARTS | Business & Imports" />
          </div>
          <div className={styles.inputGroup}>
            <label>Contact Email</label>
            <input type="email" defaultValue="support@marts.com" />
          </div>
          <div className={styles.inputGroup}>
            <label>Customer Support Phone</label>
            <input type="tel" defaultValue="+1 (555) 123-4567" />
          </div>
          <div className={styles.inputGroup}>
            <label>Store Industry</label>
            <select defaultValue="electronics">
              <option value="electronics">Electronics & Audio</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="home">Home & Garden</option>
            </select>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <h2>Regional Settings</h2>
        <p>Set your store's default currency and location.</p>
        
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Store Currency</label>
            <select defaultValue="usd">
              <option value="usd">USD ($) - US Dollar</option>
              <option value="eur">EUR (€) - Euro</option>
              <option value="gbp">GBP (£) - British Pound</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Timezone</label>
            <select defaultValue="est">
              <option value="est">Eastern Time (US & Canada)</option>
              <option value="pst">Pacific Time (US & Canada)</option>
              <option value="utc">UTC</option>
            </select>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <h2>Notifications</h2>
        <p>Manage the alerts you receive as an administrator.</p>
        
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <h4>New Order Alerts</h4>
            <p>Receive an email every time a customer completes a checkout.</p>
          </div>
          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
        </div>
        
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <h4>Low Inventory Warnings</h4>
            <p>Get notified when a product's stock level drops below 5 units.</p>
          </div>
          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
        </div>
      </section>
    </div>
  );
}
