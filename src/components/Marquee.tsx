"use client";

import { motion } from "framer-motion";
import styles from "./Marquee.module.css";

const items = [
  "GLOBAL SOURCING", "PREMIUM QUALITY", "EXQUISITE IMPORTS", 
  "FAST DELIVERY", "MARTS BUSINESS", "AUTHENTIC GOODS"
];

export default function Marquee() {
  return (
    <div className={styles.marqueeContainer}>
      <motion.div 
        className={styles.marquee}
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className={styles.item}>
            {item} <span className={styles.dot}>•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
