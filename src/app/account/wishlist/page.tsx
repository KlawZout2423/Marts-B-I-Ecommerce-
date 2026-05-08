"use client";

import React from "react";
import useSWR from "swr";
import styles from "./wishlist.module.css";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WishlistPage() {
  const { data: favData, mutate: mutateFavs } = useSWR("/api/favorites", fetcher);
  const { data: products = [] } = useSWR("/api/products", fetcher);

  const favoriteIds = favData?.favorites || [];
  const wishlistItems = Array.isArray(products) 
    ? products.filter((p: any) => favoriteIds.includes(p.id)) 
    : [];

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ productId }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        mutateFavs();
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Wishlist</h2>
        <p className={styles.subtitle}>Items you&apos;ve saved for later</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Heart size={48} strokeWidth={1.5} />
          </div>
          <h3>Your wishlist is empty</h3>
          <p>Save items you love and come back to them anytime.</p>
          <Link href="/shop" className={styles.shopBtn}>
            <ShoppingBag size={18} />
            Browse Products
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className={styles.wishlistGrid}>
          {wishlistItems.map((item: any) => (
            <div key={item.id} className={styles.wishlistCard}>
              <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.name} />
                <button 
                  className={styles.removeBtn} 
                  onClick={() => handleRemove(item.id)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className={styles.cardInfo}>
                <Link href={`/products/${item.id}`} className={styles.itemName}>
                  {item.name}
                </Link>
                <div className={styles.cardFooter}>
                  <span className={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</span>
                  <Link href={`/products/${item.id}`} className={styles.viewBtn}>
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
