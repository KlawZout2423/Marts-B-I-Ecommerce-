"use client";

import { Home, Search, ShoppingBag, User, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import styles from "./MobileBottomNav.module.css";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, setIsOpen } = useCart();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
  ];

  // Don't show bottom nav on admin or auth pages to avoid overlap
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <div className={styles.bottomNav}>
      <div className={styles.container}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href} 
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
        
        <button 
          className={styles.navItem} 
          onClick={() => setIsOpen(true)}
        >
          <div className={styles.cartIconWrapper}>
            <ShoppingBag size={22} />
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </div>
          <span className={styles.label}>Cart</span>
        </button>
      </div>
    </div>
  );
}
