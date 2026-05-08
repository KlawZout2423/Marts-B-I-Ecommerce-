"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import styles from "./settings.module.css";
import { User, Lock, Bell, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageHeader}>
        <h2 className={styles.title}>Account Settings</h2>
        <p className={styles.subtitle}>Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <User size={18} />
          <h3>Profile Information</h3>
        </div>
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              readOnly
              disabled
            />
            <span className={styles.fieldHint}>Email cannot be changed</span>
          </div>
          <button className={styles.saveBtn}>Save Changes</button>
        </div>
      </section>

      {/* Security */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <Lock size={18} />
          <h3>Security</h3>
        </div>
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>New Password</label>
            <input type="password" className={styles.input} placeholder="••••••••" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input type="password" className={styles.input} placeholder="••••••••" />
          </div>
          <button className={styles.saveBtn}>Update Password</button>
        </div>
      </section>

      {/* Notifications */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <Bell size={18} />
          <h3>Notifications</h3>
        </div>
        <div className={styles.toggleList}>
          {[
            { label: "Order updates", desc: "When your order status changes" },
            { label: "Promotions & deals", desc: "Special offers and discounts" },
            { label: "Newsletter", desc: "Weekly curated product drops" },
          ].map((item) => (
            <div key={item.label} className={styles.toggleRow}>
              <div>
                <p className={styles.toggleLabel}>{item.label}</p>
                <p className={styles.toggleDesc}>{item.desc}</p>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" defaultChecked={item.label === "Order updates"} />
                <span className={styles.slider} />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className={`${styles.card} ${styles.danger}`}>
        <div className={styles.cardHeader}>
          <Trash2 size={18} />
          <h3>Danger Zone</h3>
        </div>
        <p className={styles.dangerText}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className={styles.deleteBtn}>Delete My Account</button>
      </section>
    </div>
  );
}
