"use client";

import { useState, useEffect, useRef } from "react";
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
    const [hrefPath, hrefQuery] = href.split("?");
    if (hrefPath === "/") return pathname === "/";
    if (!hrefQuery) return pathname === hrefPath;
    // For links with query params (e.g. /shop?filter=new), match path + param
    const paramKey = hrefQuery.split("=")[0];
    const paramVal = hrefQuery.split("=")[1];
    return pathname === hrefPath && searchParams.get(paramKey) === paramVal;
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

            {/* Logo */}
            <Link href="/" className={styles.logo}>
              MARTS<span>.</span>
            </Link>

            {/* Desktop Nav Links */}
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

            {/* Actions */}
            <div className={styles.actions}>

              {/* Search Icon — opens Shopify-style overlay */}
              <button
                className={styles.actionIcon}
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search size={20} />
              </button>

              {/* Favorites / Wishlist */}
              <Link href="/wishlist" className={styles.actionIcon} aria-label="Wishlist">
                <Heart size={20} />
                {totalFavorites > 0 && (
                  <span className={styles.badge}>{totalFavorites}</span>
                )}
              </Link>

              {/* Cart */}
              <button className={styles.cartBtn} onClick={() => setCartOpen(true)} aria-label="Cart">
                <ShoppingCart size={20} />
                {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
              </button>

              {/* Account */}
              {session ? (
                <div className={styles.accountWrapper} ref={accountRef}>
                  <button
                    className={styles.avatarBtn}
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    aria-label="Account"
                  >
                    <div className={styles.userInitials}>
                      {getInitials(session.user.name || "User")}
                    </div>
                    <ChevronDown size={12} className={`${styles.chevron} ${isAccountOpen ? styles.chevronOpen : ""}`} />
                  </button>

                  {isAccountOpen && (
                    <div className={styles.accountDropdown}>
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
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className={styles.loginBtn}>
                  <User size={18} />
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button className={styles.menuBtn} onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isOpen && (
            <div className={styles.mobileNav}>
              {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`${styles.mobileNavLink} ${isLinkActive(link.href) ? styles.mobileActive : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
              ))}
              {!session && (
                <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setIsOpen(false)}>
                  Login / Sign Up
                </Link>
              )}
            </div>
          )}
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
