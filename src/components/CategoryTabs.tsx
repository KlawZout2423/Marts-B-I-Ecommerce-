"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Headphones, Watch, Smartphone, Laptop, Camera, Briefcase } from "lucide-react";
import { useEditMode } from "@/context/EditModeContext";
import styles from "./CategoryTabs.module.css";

const CATEGORIES = [
  { name: "Audio", icon: Headphones },
  { name: "Wearables", icon: Watch },
  { name: "Mobiles", icon: Smartphone },
  { name: "Computing", icon: Laptop },
  { name: "Camera", icon: Camera },
  { name: "Lifestyle", icon: Briefcase },
];

export default function CategoryTabs({ id, content }: { id?: string, content?: any }) {
  const { isEditMode, updateBlockContent } = useEditMode();
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayCategories = CATEGORIES.map((cat, i) => ({
    ...cat,
    name: content?.[`name${i}`] || cat.name
  }));

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const scrollPercent = scrollLeft / (scrollWidth - clientWidth);
    
    if (scrollPercent < 0.33) setActiveDot(0);
    else if (scrollPercent < 0.66) setActiveDot(1);
    else setActiveDot(2);
  };

  return (
    <section className={styles.section}>
      <div 
        className={`${styles.container} container`}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div className={styles.tabsWrapper}>
          {displayCategories.map((cat, i) => (
            <motion.button
              key={i}
              className={styles.tab}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 10 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={styles.iconBox}>
                <cat.icon size={24} strokeWidth={1.5} />
              </div>
              <span 
                className={`${styles.name} ${isEditMode ? styles.editable : ""}`}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => id && updateBlockContent(id, { [`name${i}`]: e.currentTarget.textContent })}
              >
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Fixed Scroll Indicator Dots */}
      <div className={styles.indicators}>
        {[0, 1, 2].map((i) => (
          <div 
            key={i} 
            className={`${styles.dot} ${activeDot === i ? styles.active : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
