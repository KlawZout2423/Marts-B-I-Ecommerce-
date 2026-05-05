import Link from "next/link";
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
          <div
            key={banner.id}
            className={styles.card}
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          >
            {/* overlay */}
            <div
              className={styles.overlay}
              style={{ background: banner.overlayGradient }}
            />

            {/* content */}
            <div className={`${styles.content} ${styles[banner.theme]}`}>
              <span
                className={styles.badge}
                style={{ background: banner.badgeColor, color: banner.theme === "light" ? "#fff" : "#1a1a1a" }}
              >
                {banner.badge}
              </span>

              <h2 
                className={`${styles.title} ${isEditMode ? styles.editable : ""}`}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => id && updateBlockContent(id, { [`title${index + 1}`]: e.currentTarget.textContent })}
              >
                {banner.title}
              </h2>

              {banner.subtitle && (
                <p 
                  className={`${styles.subtitle} ${isEditMode ? styles.editable : ""}`}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => id && updateBlockContent(id, { [`subtitle${index + 1}`]: e.currentTarget.textContent })}
                >
                  {banner.subtitle}
                </p>
              )}

              <Link href={banner.ctaHref} className={styles.cta}>
                {banner.ctaText}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
