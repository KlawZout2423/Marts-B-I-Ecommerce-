import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PromoBanner } from "@/data/promoBanners";
import { useEditMode } from "@/context/EditModeContext";
import styles from "./PromoBannerCards.module.css";

interface Props {
  id?: string;
  banners: PromoBanner[];
}

export default function PromoBannerCards({ id, banners }: Props) {
  const { isEditMode, updateBlockContent } = useEditMode();

  return (
    <section className={`${styles.section} container`}>
      <div className={styles.grid}>
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            className={styles.card}
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: [0.21, 1.02, 0.47, 0.98] }}
          >
            {/* overlay */}
            <div
              className={styles.overlay}
              style={{ background: banner.overlayGradient }}
            />

            {/* content */}
            <div className={`${styles.content} ${styles[banner.theme]}`}>
              <motion.span
                className={styles.badge}
                style={{ background: banner.badgeColor, color: banner.theme === "light" ? "#fff" : "#1a1a1a" }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
              >
                {banner.badge}
              </motion.span>

              <motion.h2 
                className={`${styles.title} ${isEditMode ? styles.editable : ""}`}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => id && updateBlockContent(id, { [`title${index + 1}`]: e.currentTarget.textContent })}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
              >
                {banner.title}
              </motion.h2>

              {banner.subtitle && (
                <motion.p 
                  className={`${styles.subtitle} ${isEditMode ? styles.editable : ""}`}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => id && updateBlockContent(id, { [`subtitle${index + 1}`]: e.currentTarget.textContent })}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.82, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
                >
                  {banner.subtitle}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
              >
                <Link href={banner.ctaHref} className={styles.cta}>
                  {banner.ctaText}
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
