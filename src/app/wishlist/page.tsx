"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import styles from "./WishlistPage.module.css";

export default function WishlistPage() {
  const { favorites } = useFavorites();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        const filtered = data.filter((p) => favorites.includes(p.id));
        setWishlistProducts(filtered);
        setIsLoading(false);
      });
  }, [favorites]);

  return (
    <main className={styles.page}>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      <section className={styles.hero}>
        <div className="container">
          <h1>My Wishlist</h1>
          <p>{favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later</p>
        </div>
      </section>

      <div className={styles.container}>
        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <Heart size={64} className={styles.emptyIcon} />
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite imports here to keep track of what you love.</p>
            <Link href="/shop" className={styles.shopBtn}>
              <ShoppingBag size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlistProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
