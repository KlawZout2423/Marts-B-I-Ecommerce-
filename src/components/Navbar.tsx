"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PromoBanner from "./PromoBanner";
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, Package, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { authClient } from "@/lib/auth-client";
import { useEditMode } from "@/context/EditModeContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const accountRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const cartContext = useCart();
  const favoritesContext = useFavorites();
  
  const totalItems = cartContext?.totalItems || 0;
  const setCartOpen = cartContext?.setIsOpen || (() => {});
  const totalFavorites = favoritesContext?.totalFavorites || 0;
  const { data: session } = authClient.useSession();
  const { isEditMode, toggleEditMode, canEdit } = useEditMode();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Close search on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "New Arrivals", href: "/shop?filter=new" },
    { name: "Sale 🔥", href: "/shop?filter=sale" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Accurately determine the active nav link, including query-param links
  const isLinkActive = (href: string): boolean => {
    if (!isMounted || !pathname) return false;

    // Split href into path and query
    const [hrefPath, hrefQuery] = href.split("?");
    
    // Exact match for the home page
    if (hrefPath === "/") {
      return pathname === "/";
    }

    // If there's a query param (like ?filter=new), we need exact matches for both
    if (hrefQuery) {
      const [key, val] = hrefQuery.split("=");
      return pathname === hrefPath && searchParams.get(key) === val;
    }

    // For regular pages like /about, we use exact path matching
    // We also avoid highlighting base /shop if a filter is active
    if (hrefPath === "/shop" && searchParams.get("filter")) {
      return false;
    }

    return pathname === hrefPath;
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsAccountOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className={styles.fixedHeader}>
        <PromoBanner />
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
          <div className={`container ${styles.navContainer}`}>
            {/* Mobile Hamburger (Extreme Left) */}
            <button className={styles.menuBtn} onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo (Centered on Mobile) */}
            <Link href="/" className={styles.logo}>
              <img src="/logo.png" alt="MARTS Logo" className={styles.logoImage} />
            </Link>

            {/* Desktop Nav Links (Hidden on Mobile) */}
            <div className={styles.desktopNav}>
              {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`${styles.navLink} ${isLinkActive(link.href) ? styles.active : ""}`}
                  >
                    {link.name}
                  </Link>
              ))}
            </div>

            {/* Actions (Right) */}
            <div className={styles.actions}>
              {/* Search Icon — Hidden on mobile as we use the full row search bar */}
              <button
                className={`${styles.actionIcon} ${styles.hideMobileSearch}`}
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={20} />
              </button>

              {/* Favorites / Wishlist — Hidden on mobile to keep Row 1 clean */}
              <Link href="/wishlist" className={`${styles.actionIcon} ${styles.hideMobile}`} aria-label="Wishlist">
                <Heart size={20} />
                {isMounted && totalFavorites > 0 && (
                  <span className={styles.badge}>{totalFavorites}</span>
                )}
              </Link>

              {/* Account */}
              {isMounted && session ? (
                <div className={styles.accountWrapper} ref={accountRef}>
                  <button
                    className={styles.avatarBtn}
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    aria-label="Account"
                  >
                    <div className={styles.userInitials}>
                      {getInitials(session.user.name || "User")}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isAccountOpen && (
                      <motion.div 
                        className={styles.accountDropdown}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <div className={styles.dropdownHeader}>
                          <div className={styles.userInitialsLarge}>
                            {getInitials(session.user.name || "User")}
                          </div>
                          <div>
                            <p className={styles.dropdownName}>{session.user.name}</p>
                            <p className={styles.dropdownEmail}>{session.user.email}</p>
                          </div>
                        </div>
                        <div className={styles.dropdownDivider} />
                        <Link href="/account" className={styles.dropdownLink} onClick={() => setIsAccountOpen(false)}>
                          <User size={15} /> Profile
                        </Link>
                        <Link href="/account/orders" className={styles.dropdownLink} onClick={() => setIsAccountOpen(false)}>
                          <Package size={15} /> My Orders
                        </Link>
                        {canEdit && (
                          <>
                            <div className={styles.dropdownDivider} />
                            <button 
                              className={`${styles.dropdownLink} ${isEditMode ? styles.editModeActive : ""}`} 
                              onClick={() => { toggleEditMode(); setIsAccountOpen(false); }}
                            >
                              <div className={styles.toggleTrack}>
                                <div className={`${styles.toggleThumb} ${isEditMode ? styles.toggleThumbActive : ""}`} />
                              </div>
                              {isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
                            </button>
                          </>
                        )}
                        <div className={styles.dropdownDivider} />
                        <button className={styles.dropdownLogout} onClick={handleLogout}>
                          <LogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className={styles.loginBtn}>
                  <User size={18} />
                  <span className={styles.hideMobile}>Sign In</span>
                </Link>
              )}

              {/* Cart */}
              <button className={styles.cartBtn} onClick={() => setCartOpen(true)} aria-label="Cart">
                <ShoppingCart size={20} />
                {isMounted && totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
              </button>
            </div>
          </div>

          {/* 📱 Mobile Search Row (Row 2) - Jumia Style */}
          <div className={styles.mobileSearchRow}>
            <form className={styles.mobileSearchForm} onSubmit={handleSearch}>
              <Search size={18} className={styles.mobileSearchIcon} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands..."
                className={styles.mobileSearchInput}
              />
            </form>
          </div>

          {/* Mobile Nav Drawer */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                className={styles.mobileNav}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`${styles.mobileNavLink} ${isLinkActive(link.href) ? styles.mobileActive : ""}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                ))}
                {isMounted && !session && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setIsOpen(false)}>
                      Login / Sign Up
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
      <div className={styles.headerSpacer} />

      {/* ── Shopify-style Search Overlay ── */}
      {isSearchOpen && (
        <div className={styles.searchOverlay} onClick={() => setIsSearchOpen(false)}>
          <div className={styles.searchOverlayInner} onClick={(e) => e.stopPropagation()}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <label htmlFor="search-input" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                Search for products
              </label>
              <Search size={22} className={styles.searchFormIcon} />
              <input
                id="search-input"
                name="q"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className={styles.searchOverlayInput}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear"
                >
                  <X size={18} />
                </button>
              )}
              <button type="submit" className={styles.searchSubmit}>
                Search
              </button>
            </form>
            <p className={styles.searchHint}>
              Press <kbd>Esc</kbd> to close · Popular: <button onClick={() => { setSearchQuery("Shoes"); }}>Shoes</button> <button onClick={() => { setSearchQuery("Electronics"); }}>Electronics</button> <button onClick={() => { setSearchQuery("Watches"); }}>Watches</button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
