"use client";

import { useEditMode } from "@/context/EditModeContext";
import styles from "./PromoBanner.module.css";

export default function PromoBanner() {
  const { isEditMode, globalBanner, setGlobalBanner } = useEditMode();

  const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    const text = e.currentTarget.textContent || "";
    if (text !== globalBanner?.text) {
      setGlobalBanner({ text });
    }
  };

  return (
    <div className={styles.banner}>
      <div className="container">
        <span
          className={`${styles.text} ${isEditMode ? styles.editable : ""}`}
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={handleBlur}
        >
          {globalBanner?.text || "Free Shipping on Orders Over $50"}
        </span>
      </div>
    </div>
  );
}
