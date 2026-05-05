"use client";

import styles from "./TrustBar.module.css";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, RefreshCw, Clock } from "lucide-react";

export default function TrustBar() {
  const items = [
    {
      icon: <Truck size={24} strokeWidth={1.5} />,
      title: "Free Shipping",
      description: "On all orders over $50",
    },
    {
      icon: <ShieldCheck size={24} strokeWidth={1.5} />,
      title: "Secure Payment",
      description: "100% secure checkout",
    },
    {
      icon: <RefreshCw size={24} strokeWidth={1.5} />,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: <Clock size={24} strokeWidth={1.5} />,
      title: "24/7 Support",
      description: "Always here to help",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.container} container`}>
        {items.map((item, i) => (
          <motion.div 
            key={i} 
            className={styles.item}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className={styles.icon}>{item.icon}</div>
            <div className={styles.text}>
              <h4 className={styles.title}>{item.title}</h4>
              <p className={styles.description}>{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
