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
  X
} from "lucide-react";
import { useSearchParams } from "next/navigation";
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
      
      <div className={styles.shopWrapper}>
        <div className={`container ${styles.shopContainer}`}>
          {/* Top Bar / Breadcrumbs */}
          <div className={styles.topBar}>
            <h1 className={styles.pageTitle}>Shop App</h1>
            <nav className={styles.breadcrumbs}>
              <span>Home</span>
              <span className={styles.separator}>/</span>
              <span className={styles.activeBreadcrumb}>Shop App</span>
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
                          if (cat.name === "All") {
                            setSearchQuery("");
                          }
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
              {/* 📱 Shopify-style Sticky Action Bar (Mobile Only) */}
              <div className={styles.stickyActionBar}>
                <div className={styles.activeFilters}>
                  <span className={styles.resultCount}>{filteredProducts.length} Products</span>
                </div>
                <button 
                  className={styles.mobileFilterBtn}
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <ArrowUpNarrowWide size={16} />
                  <span>Filter & Sort</span>
                </button>
              </div>

              {/* Mobile Category Scroll */}
              <div className={styles.mobileCategoryScroll}>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      className={`${styles.mobileCatItem} ${activeCategory === cat.name ? styles.activeMobileCat : ""}`}
                      onClick={() => {
                        setActiveCategory(cat.name);
                        if (cat.name === "All") {
                          setSearchQuery("");
                        }
                      }}
                    >
                      <Icon size={16} /> {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Drawer for Mobile */}
              {isSidebarOpen && (
                <div className={styles.drawerOverlay} onClick={() => setIsSidebarOpen(false)}>
                  <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.drawerHeader}>
                      <h3>Filter & Sort</h3>
                      <button onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
                    </div>
                    <div className={styles.drawerBody}>
                      {/* Reuse sidebar logic inside drawer for mobile */}
                      <div className={styles.filterSection}>
                        <h4 className={styles.drawerSubTitle}>Category</h4>
                        <div className={styles.drawerGrid}>
                          {categories.map(cat => (
                            <button 
                              key={cat.name}
                              className={`${styles.drawerItem} ${activeCategory === cat.name ? styles.drawerItemActive : ""}`}
                              onClick={() => setActiveCategory(cat.name)}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
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
                    </div>
                    <div className={styles.drawerFooter}>
                      <button className={styles.applyBtn} onClick={() => setIsSidebarOpen(false)}>Apply Changes</button>
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

              <ProductGrid 
                products={filteredProducts}
                isLoading={isLoading}
                emptyMessage="No products match your search or filters."
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
