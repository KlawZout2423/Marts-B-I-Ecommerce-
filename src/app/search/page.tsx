"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, X, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./SearchPage.module.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const popularCategories = ["Fashion", "Electronics", "Home Decor", "Accessories", "New Arrivals"];
  const trendingSearches = [
    "Minimalist Watches",
    "Leather Sneakers",
    "Summer Collection 2026",
    "Ergonomic Chairs"
  ];

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    router.push(`/shop?search=${encodeURIComponent(term)}`);
  };

  return (
    <main className={styles.page}>
      <Navbar />
      
      <div className={styles.searchContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Search MARTS</h1>
          <p className={styles.subtitle}>Discover items that transcend the ordinary.</p>
        </div>

        <form className={styles.searchBox} onSubmit={handleSearch}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <Search className={styles.searchIcon} size={24} />
        </form>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Popular Categories</h3>
          <div className={styles.tagGrid}>
            {popularCategories.map((cat) => (
              <button 
                key={cat} 
                className={styles.tag}
                onClick={() => router.push(`/shop?category=${encodeURIComponent(cat)}`)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Trending Searches</h3>
          <div className={styles.trendingList}>
            {trendingSearches.map((term) => (
              <div 
                key={term} 
                className={styles.trendingItem}
                onClick={() => handleQuickSearch(term)}
              >
                <TrendingUp size={18} className={styles.trendingIcon} />
                <span>{term}</span>
                <ArrowRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
