"use client";

import { motion } from "framer-motion";
import styles from "./BrandMarquee.module.css";

const BRANDS = [
  "AURORA", "CYBER", "ZENITH", "NEXUS", "VELOCITY", "ECLIPSE", "ORBIT", "PULSE"
];

export default function BrandMarquee() {
  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Trusted by Global Tech Leaders</p>
        </div>
        <div className={styles.marqueeWrapper}>
          <motion.div 
            className={styles.marquee}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span key={i} className={styles.brandName}>{brand}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
