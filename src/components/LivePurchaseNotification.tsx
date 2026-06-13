"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Product } from "@/data/products";
import styles from "./LivePurchaseNotification.module.css";

const CUSTOMERS = [
  { name: "Sarah", city: "London" },
  { name: "Michael", city: "New York" },
  { name: "Amina", city: "Accra" },
  { name: "David", city: "Toronto" },
  { name: "Kofi", city: "Tema" },
  { name: "Elena", city: "Berlin" },
  { name: "Yuki", city: "Tokyo" },
  { name: "Daniel", city: "Sydney" },
  { name: "Chloe", city: "Paris" },
  { name: "Yaw", city: "Kumasi" }
];

const TIME_OFFSETS = [
  "just now",
  "12 seconds ago",
  "30 seconds ago",
  "1 minute ago",
  "2 minutes ago",
  "3 minutes ago"
];

interface NotificationState {
  customer: typeof CUSTOMERS[0];
  product: Product;
  time: string;
}

export default function LivePurchaseNotification() {
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [current, setCurrent] = useState<NotificationState | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Fetch active products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const activeOnly = data.filter((p: any) => p.status === "active");
          setProducts(activeOnly);
        }
      })
      .catch((err) => console.error("Error loading products for toast:", err));
  }, []);

  // Cycle notification loop
  useEffect(() => {
    if (products.length === 0 || dismissed) return;

    const showNext = () => {
      // Pick random customer, product, and time offset
      const randCustomer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
      const randProduct = products[Math.floor(Math.random() * products.length)];
      const randTime = TIME_OFFSETS[Math.floor(Math.random() * TIME_OFFSETS.length)];

      setCurrent({
        customer: randCustomer,
        product: randProduct,
        time: randTime,
      });
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // First trigger after 8 seconds
    const initialTimer = setTimeout(showNext, 8000);

    // Loop trigger every 15 seconds
    const interval = setInterval(showNext, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [products, dismissed]);

  // Don't render on admin, login, or signup pages
  if (!pathname || pathname.startsWith("/admin") || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  if (dismissed || !current) return null;

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={styles.toast}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <button 
              className={styles.closeBtn} 
              onClick={() => { setIsVisible(false); setDismissed(true); }}
              aria-label="Close notification"
            >
              <X size={12} />
            </button>

            <div className={styles.imageWrapper}>
              <img 
                src={current.product.image} 
                alt={current.product.name} 
                className={styles.image}
              />
            </div>

            <div className={styles.details}>
              <span className={styles.userText}>
                <strong>{current.customer.name}</strong> from {current.customer.city}
              </span>
              <Link href={`/products/${current.product.id}`} className={styles.productName}>
                {current.product.name}
              </Link>
              <div className={styles.metaRow}>
                <span className={styles.price}>${current.product.price}</span>
                <span>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <Sparkles size={10} color="#eab308" fill="#eab308" /> {current.time}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
