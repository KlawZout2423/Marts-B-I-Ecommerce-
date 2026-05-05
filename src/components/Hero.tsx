"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEditMode } from "@/context/EditModeContext";
import styles from "./Hero.module.css";

export interface HeroContent {
  pillIcon: string;
  pillText: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  socialProofAvatars: string[];
  socialProofNumber: string;
  socialProofText: string;
  mainImage: string;
  secondaryImage: string;
  uiCardIcon: string;
  uiCardTitle: string;
  uiCardSubtitle: string;
}

const defaultContent: HeroContent = {
  pillIcon: "✨",
  pillText: "Introducing the 2026 Collection",
  titlePrefix: "Beyond Premium \n Welcome to",
  titleHighlight: "MARTS",
  subtitle: "Discover items that transcend the ordinary. Clean, modern, and built for professionals who demand the best.",
  primaryButtonText: "Shop Collection",
  secondaryButtonText: "Watch Video",
  socialProofAvatars: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
  ],
  socialProofNumber: "15,000+",
  socialProofText: "professionals",
  mainImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  secondaryImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
  uiCardIcon: "⭐",
  uiCardTitle: "Top Rated",
  uiCardSubtitle: "5.0 from 10k Reviews"
};

export default function Hero({ id, content: passedContent }: { id?: string, content?: Partial<HeroContent> }) {
  const content = { ...defaultContent, ...passedContent };

  const { isEditMode, updateBlockContent } = useEditMode();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, 50]);

  return (
    <section className={styles.hero}>
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          
          <div className={styles.content}>
            {/* Pill Badge */}
            <motion.div 
              className={`${styles.pill} ${isEditMode ? styles.editable : ""}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className={styles.sparkle}>{content.pillIcon}</span> 
              <span 
                contentEditable={isEditMode} 
                suppressContentEditableWarning
                onBlur={(e) => id && updateBlockContent(id, { pillText: e.currentTarget.textContent })}
              >
                {content.pillText}
              </span>
            </motion.div>

            <h1 className={styles.title}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ display: "block" }}
                className={isEditMode ? styles.editable : ""}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => id && updateBlockContent(id, { titlePrefix: e.currentTarget.textContent })}
              >
                {content.titlePrefix}
              </motion.span>
              <motion.span
                className={`${styles.titleHighlight} ${isEditMode ? styles.editable : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ display: "block" }}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => id && updateBlockContent(id, { titleHighlight: e.currentTarget.textContent })}
              >
                {content.titleHighlight}
              </motion.span>
            </h1>
            
            <motion.p 
              className={`${styles.subtitle} ${isEditMode ? styles.editable : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => id && updateBlockContent(id, { subtitle: e.currentTarget.textContent })}
            >
              {content.subtitle}
            </motion.p>
            
            <motion.div 
              className={styles.actionGroup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link href="/shop" className={styles.shopBtn}>
                Shop Collection <ArrowRight size={18} />
              </Link>
            </motion.div>

          </div>

          <motion.div 
            className={styles.imagePanel}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {/* Futuristic Orbit Particles */}
            {[1, 2, 3].map((p) => (
              <motion.div
                key={p}
                className={styles.particle}
                animate={{
                  x: [Math.cos(p) * 280, Math.cos(p + 2 * Math.PI) * 280],
                  y: [Math.sin(p) * 280, Math.sin(p + 2 * Math.PI) * 280],
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 8 + p * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  width: 8 + p * 2,
                  height: 8 + p * 2,
                  left: "45%",
                  top: "45%",
                }}
              />
            ))}

            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <motion.div 
                className={styles.mainImageWrapper}
                style={{ y: y1 }}
              >
                <img 
                  src={content.mainImage} 
                  alt="Featured Product" 
                  className={styles.mainImage}
                />
                <motion.div 
                  className={styles.floatingBadge}
                  style={{ y: y2 }}
                >
                  <strong>New</strong>
                  <span>Season 2026</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
