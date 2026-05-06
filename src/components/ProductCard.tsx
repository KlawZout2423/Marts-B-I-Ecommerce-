"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useEditMode } from "@/context/EditModeContext";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export default function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const { addToCart, setIsOpen } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isEditMode } = useEditMode();
  const router = useRouter();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setIsOpen(true);
  };

  const isFavorited = isFavorite(product.id);

  return (
    <motion.div
      className={`${styles.card} ${className || ""} ${isEditMode ? styles.editModeActive : ""}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      onClick={() => router.push(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className={styles.image}
        />

        {/* Heart / Favourite */}
        <button
          className={`${styles.favoriteBtn} ${isFavorited ? styles.active : ""}`}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={isFavorited ? "#ef4444" : "none"} />
        </button>
        
        {/* Inline Edit Button */}
        {isEditMode && (
          <button
            className={styles.editBtn}
            onClick={(e) => { e.stopPropagation(); console.log('Edit product:', product.id); }}
            aria-label="Edit product"
          >
            <Edit2 size={16} />
          </button>
        )}

        {/* Slide-up Add to Cart bar */}
        <button className={styles.cartBar} onClick={handleQuickAdd}>
          <ShoppingBag size={16} />
          Add to Cart
        </button>
      </div>

      {/* Info */}
      <div className={styles.details}>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.priceRow}>
          <div className={styles.pricing}>
            <span className={styles.currentPrice}>${product.price}</span>
            {product.originalPrice && Number(product.originalPrice) !== Number(product.price) && (
              <span className={styles.oldPrice}>${product.originalPrice}</span>
            )}
          </div>
          
          <button 
            className={styles.mobileAddBtn}
            onClick={handleQuickAdd}
            aria-label="Add to cart"
          >
            <ShoppingBag size={14} />
          </button>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.rating}>
            <Star size={10} fill="#f59e0b" color="#f59e0b" />
            <span>{product.rating}</span>
          </div>
          <div className={styles.soldBadge}>100+ sold</div>
        </div>
      </div>
    </motion.div>
  );
}
