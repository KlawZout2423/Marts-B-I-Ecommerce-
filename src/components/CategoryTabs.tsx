"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout, Headphones, Watch, Smartphone, Laptop, Camera, Briefcase, Shirt, BookOpen, Gamepad2, TrendingUp, Tag, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEditMode } from "@/context/EditModeContext";
import styles from "./CategoryTabs.module.css";

const CATEGORIES = [
  { name: "New Arrivals", icon: Sparkles },
  { name: "Sale", icon: Tag },
  { name: "Bestsellers", icon: TrendingUp },
  { name: "Fashion", icon: Shirt },
  { name: "Men", icon: Shirt },
  { name: "Women", icon: Shirt },
  { name: "Electronics", icon: Laptop },
  { name: "Audio", icon: Headphones },
  { name: "Wearables", icon: Watch },
  { name: "Mobiles", icon: Smartphone },
  { name: "Computing", icon: Laptop },
  { name: "Camera", icon: Camera },
  { name: "Books", icon: BookOpen },
  { name: "Toys", icon: Gamepad2 },
  { name: "Lifestyle", icon: Briefcase },
];

export default function CategoryTabs({ id, content }: { id?: string, content?: any }) {
  const { isEditMode, updateBlockContent } = useEditMode();
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFilter = searchParams ? searchParams.get("filter") : null;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const displayCategories = [
    { name: "All", icon: Layout },
    ...CATEGORIES.map((cat, i) => ({
      ...cat,
      name: content?.[`name${i}`] || cat.name
    }))
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const scrollPercent = scrollLeft / (scrollWidth - clientWidth);
    
    if (scrollPercent < 0.33) setActiveDot(0);
    else if (scrollPercent < 0.66) setActiveDot(1);
    else setActiveDot(2);
  };

  const getHref = (catName: string) => {
    const filterVal = catName === "All" ? "" : catName;
    return filterVal ? `/?filter=${encodeURIComponent(filterVal)}` : "/";
  };

  const isActive = (catName: string) => {
    if (catName === "All") {
      return !activeFilter || activeFilter.toLowerCase() === "all";
    }
    return activeFilter?.toLowerCase() === catName.toLowerCase();
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
              href={getHref(cat.name)}
              className={styles.tabLink}
            >
              <motion.button
                className={`${styles.tab} ${isActive(cat.name) ? styles.activeTab : ""}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 15 }}
              >
                <div className={styles.iconBox}>
                  <cat.icon size={26} strokeWidth={1.5} />
                </div>
                <span 
                  className={`${styles.name} ${isEditMode && cat.name !== "All" ? styles.editable : ""}`}
                  contentEditable={isEditMode && cat.name !== "All"}
                  suppressContentEditableWarning
                  onBlur={(e) => id && cat.name !== "All" && updateBlockContent(id, { [`name${i - 1}`]: e.currentTarget.textContent })}
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

