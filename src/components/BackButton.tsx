"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./BackButton.module.css";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on home page, admin pages, login/signup, or server side
  if (!mounted || pathname === "/" || pathname.startsWith("/admin") || pathname === "/login" || pathname === "/signup") return null;

  return (
    <button
      onClick={() => router.back()}
      className={styles.backBtn}
      aria-label="Go back to previous page"
      title="Go back"
    >
      <ArrowLeft size={20} />
    </button>
  );
}
