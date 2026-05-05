"use client";

import { motion } from "framer-motion";
import styles from "./CategoryGrid.module.css";
import Image from "next/image";

export interface CategoryData {
  name: string;
  subtitle: string;
  image: string;
}

interface CategoryGridProps {
  categories?: CategoryData[];
}

const defaultCategories: CategoryData[] = [
  {
    name: "Audio",
    subtitle: "High-fidelity sound",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Wearables",
    subtitle: "Smart tech",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Lifestyle",
    subtitle: "Premium accessories",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
  }
];

export default function CategoryGrid({ categories = defaultCategories }: CategoryGridProps) {
  return (
    <section className={styles.section}>
      <div className={`${styles.container} container`}>
        <div className={styles.header}>
          <div className={styles.divider} />
          <h2 className={styles.title}>Shop by Category</h2>
          <div className={styles.divider} />
        </div>
        
        <div className={styles.grid}>
          {categories.map((cat, i) => (
            <motion.div 
              key={i} 
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className={styles.info}>
                <h3 className={styles.name}>{cat.name}</h3>
                <span className={styles.subtitle}>{cat.subtitle}</span>
              </div>
              <div className={styles.imageWrapper}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={600}
                  height={450}
                  className={styles.image}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
