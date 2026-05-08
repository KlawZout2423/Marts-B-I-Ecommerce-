"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import styles from "../AdminPages.module.css";
import { useStore } from "@/context/StoreContext";

export default function SettingsPage() {
  const { refreshSettings } = useStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "MARTS | Business & Imports",
    contactEmail: "support@marts.com",
    contactPhone: "",
    whatsappNumber: "",
    currency: "USD",
    timezone: "UTC",
    orderEmails: true,
    lowStockAlerts: true,
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings(data);
        }
      })
      .catch((err) => console.error("Failed to fetch settings", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        await refreshSettings();
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch (err) {
      toast.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Loader2 className="animate-spin" size={32} color="#0ea5e9" />
      </div>
    );
  }

  return (
    <div>
      <header className={styles.pageHeader}>
        <div>
          <h1>Store Settings</h1>
          <p>Configure your store details, regional settings, and notifications.</p>
        </div>
        <button 
          className={styles.primaryBtn} 
          onClick={handleSave}
          disabled={saving}
          style={{ background: saving ? '#94a3b8' : '#0047AB' }}
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </header>

      <section className={styles.formSection}>
        <h2>Store Details</h2>
        <p>The basic information used publicly on your storefront and emails.</p>
        
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Store Name</label>
            <input 
              type="text" 
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Contact Email</label>
            <input 
              type="email" 
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Customer Support Phone</label>
            <input 
              type="tel" 
              placeholder="+1 (555) 000-0000"
              value={settings.contactPhone || ""}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Order WhatsApp Number (Include Country Code)</label>
            <input 
              type="text" 
              placeholder="e.g. 233540000000"
              value={settings.whatsappNumber || ""}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <h2>Regional Settings</h2>
        <p>Set your store's default currency and location.</p>
        
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Store Currency</label>
            <select 
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="GHS">GHS (GH₵) - Ghana Cedi</option>
              <option value="NGN">NGN (₦) - Nigerian Naira</option>
              <option value="KES">KES (KSh) - Kenyan Shilling</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Timezone</label>
            <select 
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            >
              <option value="UTC">UTC (Universal Time)</option>
              <option value="EST">Eastern Time (US & Canada)</option>
              <option value="PST">Pacific Time (US & Canada)</option>
              <option value="WAT">West Africa Time</option>
              <option value="EAT">East Africa Time</option>
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
          <input 
            type="checkbox" 
            checked={settings.orderEmails}
            onChange={(e) => setSettings({ ...settings, orderEmails: e.target.checked })}
            style={{ width: '20px', height: '20px', accentColor: '#0047AB' }} 
          />
        </div>
        
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <h4>Low Inventory Warnings</h4>
            <p>Get notified when a product's stock level drops below 5 units.</p>
          </div>
          <input 
            type="checkbox" 
            checked={settings.lowStockAlerts}
            onChange={(e) => setSettings({ ...settings, lowStockAlerts: e.target.checked })}
            style={{ width: '20px', height: '20px', accentColor: '#0047AB' }} 
          />
        </div>
      </section>
    </div>
  );
}
