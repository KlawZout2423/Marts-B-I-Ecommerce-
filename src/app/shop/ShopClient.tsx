"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { Product } from "@/data/products";
import { 
  Search, 
  ChevronRight, 
  LayoutGrid, 
  Menu as MenuIcon,
  Shirt,
  Book,
  Gamepad2,
  Laptop,
  Check,
  TrendingUp,
  TrendingDown,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  Clock,
  Layout,
  X,
  ShoppingCart,
  Heart,
  Star,
  Shield,
  Eye
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styles from "./ShopPage.module.css";

export default function ShopClient() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter");
  const initialSearch = searchParams.get("search") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialFilter || "All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync searchQuery with URL param when it changes
  useEffect(() => {
    const s = searchParams.get("search");
    if (s !== null) {
      setSearchQuery(s);
    }
  }, [searchParams]);


  const categories = [
    { name: "All", icon: Layout },
    { name: "Fashion", icon: Shirt },
    { name: "Men", icon: Shirt },
    { name: "Women", icon: Shirt },
    { name: "Unisex", icon: Shirt },
    { name: "Books", icon: Book },
    { name: "Toys", icon: Gamepad2 },
    { name: "Electronics", icon: Laptop },
    { name: "bestseller", icon: TrendingUp },
  ];

  const sortOptions = [
    { id: "newest", name: "Newest", icon: Clock },
    { id: "price-high", name: "Price High", icon: ArrowUpNarrowWide },
    { id: "price-low", name: "Price Low", icon: ArrowDownWideNarrow },
    { id: "discounted", name: "Discounted", icon: TrendingDown },
  ];

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllProducts(data);
        } else {
          console.error("Shop API returned non-array data:", data);
          setAllProducts([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Shop API fetch failed:", err);
        setAllProducts([]);
        setIsLoading(false);
      });
  }, []);

  // Sync activeCategory with URL filter param
  useEffect(() => {
    const f = searchParams.get("filter");
    if (f) {
      setActiveCategory(f);
    } else {
      setActiveCategory("All");
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Handle special filters first
    if (activeCategory === "new") {
      // 30-Day Auto-Expiry Logic: 
      // Only show 'new_arrivals' if they are less than 30 days old.
      const taggedNew = result.filter(p => {
        try {
          const placements = p.placements || [];
          if (!placements.includes("new_arrivals")) return false;
          
          const createdDate = new Date(p.createdAt);
          const diffDays = Math.ceil(Math.abs(Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
          
          return diffDays <= 30; 
        } catch { return false; }
      });
      
      if (taggedNew.length > 0) {
        result = taggedNew;
      } else {
        // Fallback: Just show the latest 12 products
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 12);
      }
    } else if (activeCategory === "bestseller") {
      // Show products with 'bestseller' in placements
      result = result.filter(p => {
        try {
          const placements = p.placements || [];
          return placements.includes("bestseller");
        } catch { return false; }
      });
    } else if (activeCategory === "sale") {
      // Priority: Products with 'hot_sale' in placements, then items with discount
      const taggedSale = result.filter(p => {
        try {
          const placements = p.placements || [];
          return placements.includes("hot_sale");
        } catch { return false; }
      });

      if (taggedSale.length > 0) {
        result = taggedSale;
      } else {
        result = result.filter(p => (p as any).originalPrice && (p as any).originalPrice > p.price);
      }
    } else if (activeCategory !== "All") {
      // Regular category filtering
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "discounted") {
      result = result.filter(p => p.originalPrice);
    }



    return result;
  }, [allProducts, activeCategory, sortBy, searchQuery]);

  return (
    <main className={styles.page}>
      <Navbar />

      {/* ── Temu-style Sticky Category + Filter Bar (Mobile Only) ── */}
      <div className={styles.mobileTopBar}>
        <div className={styles.mobileCategoryScroll}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                className={`${styles.mobileCatItem} ${activeCategory === cat.name ? styles.activeMobileCat : ""}`}
                onClick={() => {
                  setActiveCategory(cat.name);
                  if (cat.name === "All") setSearchQuery("");
                }}
              >
                <Icon size={14} /> {cat.name}
              </button>
            );
          })}
        </div>
        <button
          className={styles.mobileFilterBtn}
          onClick={() => setIsSidebarOpen(true)}
        >
          <ArrowUpNarrowWide size={15} />
          <span>Filter</span>
        </button>
      </div>
      
      <div className={styles.shopWrapper}>
        <div className={`container ${styles.shopContainer}`}>
          {/* Top Bar / Breadcrumbs */}
          <div className={styles.topBar}>
            <h1 className={styles.pageTitle}>Shop</h1>
            <nav className={styles.breadcrumbs}>
              <span>Home</span>
              <span className={styles.separator}>/</span>
              <span className={styles.activeBreadcrumb}>Shop</span>
            </nav>
          </div>

          <div className={`${styles.mainLayout} ${isSidebarCollapsed ? styles.mainLayoutCollapsed : ""}`}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.sidebarCollapsed : ""}`}>
              <div className={styles.filterSection}>
                <h3 className={styles.sectionTitle}>Filter By Category</h3>
                <div className={styles.filterList}>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.name}
                        className={`${styles.filterItem} ${activeCategory === cat.name ? styles.activeFilter : ""}`}
                        onClick={() => {
                          setActiveCategory(cat.name);
                          if (cat.name === "All") setSearchQuery("");
                        }}
                      >
                        <Icon size={18} /> {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.filterSection}>
                <h3 className={styles.sectionTitle}>Sort By</h3>
                <div className={styles.filterList}>
                  {sortOptions.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        className={`${styles.filterItem} ${sortBy === opt.id ? styles.activeFilter : ""}`}
                        onClick={() => setSortBy(opt.id)}
                      >
                        <Icon size={18} /> {opt.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.filterSection}>
                <h3 className={styles.sectionTitle}>By Gender</h3>
                <div className={styles.filterList}>
                  {["Men", "Women", "Unisex"].map(gender => (
                    <button 
                      key={gender}
                      className={`${styles.filterItem} ${activeCategory === gender ? styles.activeFilter : ""}`}
                      onClick={() => setActiveCategory(gender)}
                    >
                      <Check size={18} color={activeCategory === gender ? "#0f172a" : "transparent"} /> {gender}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <div className={styles.contentArea}>

              {/* Sidebar Drawer for Mobile */}
              {isSidebarOpen && (
                <div className={styles.drawerOverlay} onClick={() => setIsSidebarOpen(false)}>
                  <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.drawerHeader}>
                      <h3>Filter & Sort</h3>
                      <button onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
                    </div>
                    <div className={styles.drawerBody}>
                      <div className={styles.filterSection}>
                        <h4 className={styles.drawerSubTitle}>Sort By</h4>
                        <div className={styles.drawerGrid}>
                          {sortOptions.map(opt => (
                            <button 
                              key={opt.id}
                              className={`${styles.drawerItem} ${sortBy === opt.id ? styles.drawerItemActive : ""}`}
                              onClick={() => setSortBy(opt.id)}
                            >
                              {opt.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className={styles.filterSection}>
                        <h4 className={styles.drawerSubTitle}>By Gender</h4>
                        <div className={styles.drawerGrid}>
                          {["Men", "Women", "Unisex"].map(gender => (
                            <button
                              key={gender}
                              className={`${styles.drawerItem} ${activeCategory === gender ? styles.drawerItemActive : ""}`}
                              onClick={() => setActiveCategory(gender)}
                            >
                              {gender}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={styles.drawerFooter}>
                      <button className={styles.applyBtn} onClick={() => setIsSidebarOpen(false)}>Apply</button>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.contentHeader}>
                <div className={styles.headerLeft}>
                  <button 
                    className={styles.sidebarToggle}
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  >
                    <MenuIcon size={18} />
                    <span>{isSidebarCollapsed ? "Show Filters" : "Hide Filters"}</span>
                  </button>
                  <h2 className={styles.productsHeading}>Products</h2>
                </div>
                <div className={styles.searchWrapper}>
                  <Search size={18} className={styles.searchIcon} />
                  <input 
                    type="text" 
                    placeholder="Search catalog..." 
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Active Filters Row */}
              {(activeCategory !== "All" || sortBy !== "newest" || searchQuery) && (
                <div className={styles.activeFiltersRow}>
                  <span className={styles.activeFiltersLabel}>Active Filters:</span>
                  <div className={styles.activeFiltersList}>
                    {activeCategory !== "All" && (
                      <span className={styles.filterPill}>
                        Category: {activeCategory}
                        <button onClick={() => setActiveCategory("All")} aria-label="Remove category filter"><X size={12} /></button>
                      </span>
                    )}
                    {sortBy !== "newest" && (
                      <span className={styles.filterPill}>
                        Sort: {sortOptions.find(o => o.id === sortBy)?.name || sortBy}
                        <button onClick={() => setSortBy("newest")} aria-label="Remove sort filter"><X size={12} /></button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className={styles.filterPill}>
                        Search: "{searchQuery}"
                        <button onClick={() => setSearchQuery("")} aria-label="Clear search query"><X size={12} /></button>
                      </span>
                    )}
                    <button 
                      className={styles.clearAllBtn}
                      onClick={() => {
                        setActiveCategory("All");
                        setSortBy("newest");
                        setSearchQuery("");
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              <ProductGrid 
                products={filteredProducts}
                isLoading={isLoading}
                emptyMessage="No products match your search or filters."
                onQuickView={setSelectedProduct}
                showPromoCard={true}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <QuickViewModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, setIsOpen } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { settings } = useStore();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedOption, setSelectedOption] = useState("Standard Edition");

  const isFav = isFavorite(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setIsOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <motion.div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className={styles.modalGrid}>
          {/* Left: Image Container */}
          <div className={styles.modalImageContainer}>
            <Image 
              src={product.image} 
              alt={product.name} 
              width={500} 
              height={500} 
              className={styles.modalImage} 
              priority
            />
            {product.originalPrice && (
              <span className={styles.modalSaleBadge}>Sale</span>
            )}
          </div>

          {/* Right: Info */}
          <div className={styles.modalInfoContainer}>
            <span className={styles.modalCategory}>{product.category}</span>
            <h2 className={styles.modalTitle}>{product.name}</h2>
            
            <div className={styles.modalRatingRow}>
              <div className={styles.modalStars}>
                <Star size={14} fill="currentColor" className={styles.starIcon} />
                <span className={styles.modalRatingVal}>{product.rating || 4.5}</span>
              </div>
              <span className={styles.modalReviewsCount}>({product.reviewCount || 10} reviews)</span>
            </div>

            <div className={styles.modalPriceRow}>
              <span className={styles.modalCurrentPrice}>{settings.currencySymbol}{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className={styles.modalOldPrice}>{settings.currencySymbol}{product.originalPrice}</span>
                  <span className={styles.modalDiscountPercent}>
                    {Math.round((1 - Number(product.price)/Number(product.originalPrice)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className={styles.modalDescription}>
              {product.description || "Premium product sourced globally by MARTS."}
            </p>

            {/* Options */}
            <div className={styles.modalOptionsSection}>
              <span className={styles.modalSectionLabel}>Select Pack</span>
              <div className={styles.modalOptionsList}>
                {["Standard Edition", "Premium Pack"].map(opt => (
                  <button 
                    key={opt} 
                    className={`${styles.modalOptionBtn} ${selectedOption === opt ? styles.modalOptionBtnActive : ""}`}
                    onClick={() => setSelectedOption(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.modalActionsRow}>
              <div className={styles.modalQtyControls}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} className={styles.qtyBtn}>−</button>
                <span className={styles.modalQty}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} className={styles.qtyBtn}>+</button>
              </div>

              <button 
                className={`${styles.modalAddBtn} ${added ? styles.modalAddBtnSuccess : ""}`}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                {added ? "Added!" : "Add to Cart"}
              </button>

              <button 
                className={`${styles.modalWishlistBtn} ${isFav ? styles.modalWishlistActive : ""}`}
                onClick={() => toggleFavorite(product.id)}
                aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={20} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>

            <div className={styles.modalFooterLink}>
              <Link href={`/products/${product.id}`} className={styles.viewFullDetailsLink} onClick={onClose}>
                <Eye size={16} /> View Full Details & Specifications
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
