"use client";

import Link from "next/link";
import { Home, BookOpen, Phone, ShoppingBag, ExternalLink, Edit3 } from "lucide-react";
import styles from "./Editor.module.css";
import { useEditMode } from "@/context/EditModeContext";
import { useRouter } from "next/navigation";

const pages = [
  {
    name: "Homepage",
    path: "/",
    icon: <Home size={28} />,
    description: "Edit your hero banner, promo sections, and featured products.",
    color: "#6366f1",
  },
  {
    name: "About Us",
    path: "/about",
    icon: <BookOpen size={28} />,
    description: "Update your brand story, team, and values.",
    color: "#0ea5e9",
  },
  {
    name: "Contact",
    path: "/contact",
    icon: <Phone size={28} />,
    description: "Edit contact info, office hours, and the contact form.",
    color: "#22c55e",
  },
  {
    name: "Shop",
    path: "/shop",
    icon: <ShoppingBag size={28} />,
    description: "Configure your product grid, filters, and collection banners.",
    color: "#f59e0b",
  },
];

export default function ContentCMSLauncher() {
  const { toggleEditMode, isEditMode } = useEditMode();
  const router = useRouter();

  const handleEditPage = (path: string) => {
    if (!isEditMode) toggleEditMode();
    router.push(path);
  };

  return (
    <div className={styles.launcherPage}>
      <div className={styles.launcherHeader}>
        <h1>Content Editor</h1>
        <p>Choose a page to edit it directly in your live storefront.</p>
      </div>

      <div className={styles.pageGrid}>
        {pages.map((page) => (
          <div key={page.path} className={styles.pageCard}>
            <div className={styles.pageCardIcon} style={{ background: page.color + "15", color: page.color }}>
              {page.icon}
            </div>
            <div className={styles.pageCardInfo}>
              <h2>{page.name}</h2>
              <p>{page.description}</p>
            </div>
            <div className={styles.pageCardActions}>
              <button
                className={styles.editPageBtn}
                onClick={() => handleEditPage(page.path)}
                style={{ background: page.color }}
              >
                <Edit3 size={16} />
                Edit Page
              </button>
              <Link href={page.path} target="_blank" className={styles.viewBtn}>
                <ExternalLink size={15} />
                Preview
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.launcherTip}>
        <strong>How it works:</strong> Click &ldquo;Edit Page&rdquo; to open the live page with edit mode enabled. Click on any text or section to modify it directly. Use the save bar at the bottom to publish your changes.
      </div>
    </div>
  );
}
