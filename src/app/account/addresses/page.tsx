"use client";

import React, { useState } from "react";
import useSWR from "swr";
import styles from "./addresses.module.css";
import { MapPin, Plus, Home, Trash2, Edit2, X, Briefcase, Building2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AddressesPage() {
  const { data: addresses = [], mutate, isLoading } = useSWR("/api/addresses", fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    label: "Home",
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "Nigeria",
    isDefault: false
  });

  const openModal = (address: any = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        label: address.label,
        name: address.name,
        phone: address.phone || "",
        line1: address.line1,
        line2: address.line2 || "",
        city: address.city,
        state: address.state || "",
        country: address.country,
        isDefault: address.isDefault
      });
    } else {
      setEditingAddress(null);
      setFormData({
        label: "Home",
        name: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "Nigeria",
        isDefault: addresses.length === 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingAddress ? `/api/addresses/${editingAddress.id}` : "/api/addresses";
      const method = editingAddress ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingAddress ? "Address updated!" : "Address added!");
        mutate();
        closeModal();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to save address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Address removed.");
        mutate();
      }
    } catch (error) {
      toast.error("Failed to delete address.");
    }
  };

  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "home": return Home;
      case "office":
      case "work": return Briefcase;
      default: return Building2;
    }
  };

  if (isLoading) return <div className={styles.loadingContainer}>Loading addresses...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>My Addresses</h2>
          <p className={styles.subtitle}>Manage your delivery locations</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal()}>
          <Plus size={18} /> Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <MapPin size={48} strokeWidth={1.5} />
          </div>
          <h3>No addresses saved yet</h3>
          <p>Save your shipping locations for faster checkout.</p>
          <button onClick={() => openModal()} className={styles.shopLink}>Add Your First Address</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {addresses.map((addr: any) => {
            const Icon = getIcon(addr.label);
            return (
              <div key={addr.id} className={`${styles.card} ${addr.isDefault ? styles.default : ""}`}>
                {addr.isDefault && <span className={styles.defaultBadge}>Default</span>}
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>
                    <Icon size={20} />
                  </div>
                  <span className={styles.cardLabel}>{addr.label}</span>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.addressName}>{addr.name}</p>
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>{addr.city}{addr.state ? `, ${addr.state}` : ""}</p>
                  <p>{addr.country}</p>
                  {addr.phone && <p className={styles.phoneLabel}>{addr.phone}</p>}
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.editBtn} onClick={() => openModal(addr)}><Edit2 size={14} /> Edit</button>
                  {!addr.isDefault && (
                    <button className={styles.deleteBtn} onClick={() => handleDelete(addr.id)}><Trash2 size={14} /> Remove</button>
                  )}
                </div>
              </div>
            );
          })}

          <button className={styles.addCard} onClick={() => openModal()}>
            <Plus size={32} strokeWidth={1.5} />
            <span>Add New Address</span>
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingAddress ? "Edit Address" : "Add New Address"}</h3>
              <button className={styles.closeBtn} onClick={closeModal}><X size={24} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.modalBody}>
                <div className={styles.inputGroup}>
                  <label>Label (e.g. Home, Office)</label>
                  <select 
                    value={formData.label} 
                    onChange={e => setFormData({...formData, label: e.target.value})}
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="+234..."
                    />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Address Line 1</label>
                  <input 
                    type="text" 
                    value={formData.line1} 
                    onChange={e => setFormData({...formData, line1: e.target.value})}
                    placeholder="Street name and number"
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Address Line 2 (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.line2} 
                    onChange={e => setFormData({...formData, line2: e.target.value})}
                    placeholder="Apartment, suite, etc."
                  />
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>City</label>
                    <input 
                      type="text" 
                      value={formData.city} 
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>State / Region</label>
                    <input 
                      type="text" 
                      value={formData.state} 
                      onChange={e => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Country</label>
                  <input 
                    type="text" 
                    value={formData.country} 
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    required
                  />
                </div>
                <label className={styles.checkboxGroup}>
                  <input 
                    type="checkbox" 
                    checked={formData.isDefault}
                    onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                    disabled={editingAddress?.isDefault}
                  />
                  <span>Set as default address</span>
                </label>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelModalBtn} onClick={closeModal}>Cancel</button>
                <button type="submit" className={styles.saveModalBtn} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (editingAddress ? "Update Address" : "Save Address")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
