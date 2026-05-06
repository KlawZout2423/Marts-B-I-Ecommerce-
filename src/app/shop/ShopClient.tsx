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
  TrendingDown,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  Clock,
  Layout
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
  const [priceRange, setPriceRange] = useState([0, 5000]);

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

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (activeCategory !== "All") {
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

    result = result.filter(p => {
      const price = Number(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });


    return result;
  }, [allProducts, activeCategory, sortBy, searchQuery]);

  return (
    <main className={styles.page}>
      <Navbar />
      
      <div className={styles.shopWrapper}>
        <div className="container">
          {/* Top Bar / Breadcrumbs */}
          <div className={styles.topBar}>
            <h1 className={styles.pageTitle}>Shop App</h1>
            <nav className={styles.breadcrumbs}>
              <span>Home</span>
              <span className={styles.separator}>/</span>
              <span className={styles.activeBreadcrumb}>Shop App</span>
            </nav>
          </div>

          <div className={styles.mainLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
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
                            setPriceRange([0, 5000]);
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
                <h3 className={styles.sectionTitle}>Price Range</h3>
                <div style={{ padding: '0 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
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
                          setPriceRange([0, 5000]);
                        }
                      }}
                    >
                      <Icon size={16} /> {cat.name}
                    </button>
                  );
                })}
              </div>

              <div className={styles.contentHeader}>
                <h2 className={styles.productsHeading}>Products</h2>
                <div className={styles.searchWrapper}>
                  <Search size={18} className={styles.searchIcon} />
                  <input 
                    type="text" 
                    placeholder="Look up Products..." 
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
