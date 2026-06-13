"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Sparkles, HelpCircle } from "lucide-react";
import { useEditMode } from "@/context/EditModeContext";
import styles from "./MobilePromoBanner.module.css";

interface MobilePromoContent {
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  bgGradient: string;
  theme: "light" | "dark";
}

const defaultPromoContent: MobilePromoContent = {
  badge: "🔥 APP ONLY DEALS",
  badgeColor: "#ffe600",
  title: "Exclusive Mobile Offer",
  subtitle: "Get 15% off all orders with code MOBILE15",
  ctaText: "Shop Sale",
  ctaLink: "/shop?filter=sale",
  bgGradient: "linear-gradient(135deg, #0047AB 0%, #002D62 100%)",
  imageUrl: "",
  theme: "dark",
};

interface MobilePromoBannerProps {
  id: string;
  content?: Partial<MobilePromoContent>;
}

const GRADIENTS = [
  { name: "Classic Royal", value: "linear-gradient(135deg, #0047AB 0%, #002D62 100%)" },
  { name: "Sunset Rose", value: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)" },
  { name: "Emerald Luxe", value: "linear-gradient(135deg, #059669 0%, #064e3b 100%)" },
  { name: "Neon Purple", value: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)" },
  { name: "Dark Slate", value: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" },
];

export default function MobilePromoBanner({ id, content: passedContent }: MobilePromoBannerProps) {
  const content = { ...defaultPromoContent, ...passedContent };
  const { isEditMode, updateBlockContent } = useEditMode();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth <= 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Hide completely on desktop when not in edit mode
  if (!isMobile && !isEditMode) {
    return null;
  }

  const handleTextUpdate = (field: keyof MobilePromoContent, text: string) => {
    updateBlockContent(id, { [field]: text });
  };

  const handleSelectImage = () => {
    const url = prompt("Enter background image URL (leave empty to use gradient):", content.imageUrl);
    if (url !== null) {
      updateBlockContent(id, { imageUrl: url });
    }
  };

  const handleSelectLink = () => {
    const link = prompt("Enter CTA Button URL Link:", content.ctaLink);
    if (link !== null) {
      updateBlockContent(id, { ctaLink: link });
    }
  };

  const handleGradientChange = (gradientValue: string) => {
    updateBlockContent(id, { bgGradient: gradientValue });
  };

  const handleThemeToggle = (theme: "light" | "dark") => {
    updateBlockContent(id, { theme });
  };

  const cardStyle: React.CSSProperties = {
    backgroundImage: content.imageUrl ? `url(${content.imageUrl})` : "none",
    background: content.imageUrl ? undefined : content.bgGradient,
  };

  const badgeStyle: React.CSSProperties = {
    background: content.theme === "dark" ? "#ffe600" : "#0f172a",
    color: content.theme === "dark" ? "#0f172a" : "#ffffff",
  };

  const ctaStyle: React.CSSProperties = {
    background: content.theme === "dark" ? "#ffffff" : "#0047AB",
    color: content.theme === "dark" ? "#0f172a" : "#ffffff",
  };

  const overlayBg = content.theme === "dark" 
    ? "linear-gradient(to right, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.3) 100%)" 
    : "linear-gradient(to right, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0.4) 100%)";

  const renderBanner = () => (
    <div 
      className={`${styles.bannerCard} ${content.theme === "dark" ? styles.darkTheme : styles.lightTheme}`}
      style={cardStyle}
    >
      {/* Semi-transparent overlay for image readability */}
      {content.imageUrl && (
        <div className={styles.overlay} style={{ background: overlayBg }} />
      )}

      {/* Floating Image Picker Button in Edit Mode */}
      {isEditMode && (
        <button 
          className={styles.imgSelectBtn} 
          onClick={handleSelectImage}
          title="Change background image"
        >
          <ImageIcon size={16} color="#0047AB" />
        </button>
      )}

      <div className={styles.content}>
        {/* Badge */}
        <span 
          className={`${styles.badge} ${isEditMode ? styles.editable : ""}`}
          style={badgeStyle}
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleTextUpdate("badge", e.currentTarget.textContent || "")}
        >
          {content.badge}
        </span>

        {/* Title */}
        <h2 
          className={`${styles.title} ${isEditMode ? styles.editable : ""}`}
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleTextUpdate("title", e.currentTarget.textContent || "")}
        >
          {content.title}
        </h2>

        {/* Subtitle */}
        <p 
          className={`${styles.subtitle} ${isEditMode ? styles.editable : ""}`}
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) => handleTextUpdate("subtitle", e.currentTarget.textContent || "")}
        >
          {content.subtitle}
        </p>

        {/* Action Button */}
        {isEditMode ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span 
              className={`${styles.ctaBtn} ${styles.editable}`}
              style={ctaStyle}
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTextUpdate("ctaText", e.currentTarget.textContent || "")}
            >
              {content.ctaText}
            </span>
            <button 
              className={styles.toggleBtn}
              onClick={handleSelectLink}
              style={{ padding: "6px 10px" }}
              title="Change Button Link"
            >
              Link 🔗
            </button>
          </div>
        ) : (
          <Link href={content.ctaLink} className={styles.ctaBtn} style={ctaStyle}>
            {content.ctaText} <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.mobilePromoWrapper}>
      {/* If rendering desktop preview, wrap in a designated dashed layout */}
      {!isMobile && isEditMode ? (
        <div className={styles.desktopPreview}>
          <div className={styles.desktopPreviewHeader}>
            <Sparkles size={14} /> Mobile Promo Banner (Preview Mode)
          </div>
          {renderBanner()}
          
          {/* Quick Controls in Edit Mode */}
          <div className={styles.editorToolbar}>
            <div className={styles.toolbarRow}>
              <span className={styles.toolbarLabel}>Style:</span>
              {GRADIENTS.map((g) => (
                <button
                  key={g.name}
                  className={`${styles.colorPill} ${content.bgGradient === g.value ? styles.colorPillActive : ""}`}
                  style={{ background: g.value }}
                  onClick={() => handleGradientChange(g.value)}
                  title={g.name}
                />
              ))}
            </div>
            
            <div className={styles.toolbarRow}>
              <span className={styles.toolbarLabel}>Theme:</span>
              <button
                className={`${styles.toggleBtn} ${content.theme === "dark" ? styles.toggleBtnActive : ""}`}
                onClick={() => handleThemeToggle("dark")}
              >
                Dark Mode
              </button>
              <button
                className={`${styles.toggleBtn} ${content.theme === "light" ? styles.toggleBtnActive : ""}`}
                onClick={() => handleThemeToggle("light")}
              >
                Light Mode
              </button>
            </div>
          </div>
        </div>
      ) : (
        renderBanner()
      )}
    </div>
  );
}
