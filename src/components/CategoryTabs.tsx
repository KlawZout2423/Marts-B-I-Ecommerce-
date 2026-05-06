"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Headphones, Watch, Smartphone, Laptop, Camera, Briefcase } from "lucide-react";
import Link from "next/link";
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
            <Link 
              key={i} 
              href={`/shop?filter=${cat.name}`}
              className={styles.tabLink}
            >
              <motion.button
                className={styles.tab}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 15 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.iconBox}>
                  <cat.icon size={26} strokeWidth={1.5} />
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
            </Link>
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
