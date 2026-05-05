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

  // Don't render on the home page or server side
  if (!mounted || pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      className={styles.backBtn}
      aria-label="Go back to previous page"
    >
      <ArrowLeft size={24} />
    </button>
  );
}
