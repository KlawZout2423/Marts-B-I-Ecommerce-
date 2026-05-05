"use client";

import { Globe, ShieldCheck, Zap, Truck } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./Features.module.css";

const features = [
  {
    icon: <Globe size={32} />,
    title: "Global Sourcing",
    description: "We partner with the world's finest craftsmen to bring you goods you won't find anywhere else."
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Quality Guaranteed",
    description: "Every item we import undergoes a rigorous quality control process before it reaches your door."
  },
  {
    icon: <Zap size={32} />,
    title: "Fast Logistics",
    description: "Our optimized supply chain ensures your global imports arrive faster than you expect."
  }
];

export default function Features() {
  return (
    <section className={styles.section}>
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={styles.icon}>{feature.icon}</div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.description}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
