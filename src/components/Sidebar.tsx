"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, User, Home, 
  Layers, Info, Settings, Layout
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLayout } from "@/context/LayoutContext";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const { totalItems, setIsOpen: setIsCartOpen } = useCart();
  const { mode, toggleMode } = useLayout();

  if (mode !== "sidebar") return null;

  return (
    <motion.aside 
      className={styles.sidebar}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className={styles.top}>
        <Link href="/" className={styles.logo}>L</Link>
      </div>

      <nav className={styles.nav}>
        <Link href="/" className={styles.navItem} title="Home">
          <Home size={22} />
        </Link>
        <Link href="/shop" className={styles.navItem} title="Shop">
          <ShoppingBag size={22} />
        </Link>
        <Link href="/collections" className={styles.navItem} title="Collections">
          <Layers size={22} />
        </Link>
        <Link href="/about" className={styles.navItem} title="About">
          <Info size={22} />
        </Link>
      </nav>

      <div className={styles.bottom}>
        <button className={styles.navItem} onClick={() => setIsCartOpen(true)} title="Cart">
          <ShoppingBag size={22} />
          {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
        </button>
        <button className={styles.navItem} title="Account">
          <User size={22} />
        </button>
        <button 
          className={`${styles.navItem} ${styles.toggleMode}`} 
          onClick={toggleMode}
          title="Switch to Top Nav"
        >
          <Layout size={22} />
        </button>
      </div>
    </motion.aside>
  );
}
