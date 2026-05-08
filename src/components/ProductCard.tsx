"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Heart, Trash2 } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useEditMode } from "@/context/EditModeContext";
import { useStore } from "@/context/StoreContext";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";
import styles from "./ProductCard.module.css";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export default function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const { addToCart, setIsOpen } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isEditMode } = useEditMode();
  const { settings } = useStore();
  const router = useRouter();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setIsOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      toast.warning(`Delete "${product.name}"?`, {
        description: "This cannot be undone.",
        action: {
          label: "Delete",
          onClick: async () => {
            setIsDeleting(true);
            try {
              const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
              if (res.ok) {
                toast.success("Product deleted.");
                // Preserve edit mode across reload
                const url = new URL(window.location.href);
                url.searchParams.set('edit', 'true');
                setTimeout(() => window.location.href = url.toString(), 800);
              } else {
                toast.error("Failed to delete product.");
              }
            } catch (err) {
              toast.error("Failed to delete product.");
            } finally {
              setIsDeleting(false);
              setConfirmingDelete(false);
            }
          }
        },
        onDismiss: () => setConfirmingDelete(false),
        duration: 5000,
      });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/admin/products/${product.id}`);
  };

  const isFavorited = isFavorite(product.id);

  return (
    <motion.div
      className={`${styles.card} ${className || ""} ${isEditMode ? styles.editModeActive : ""}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: (index % 4) * 0.1,
        ease: [0.21, 1.11, 0.81, 0.99] // Premium spring-like ease
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={() => !isEditMode && router.push(`/products/${product.id}`)}
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
        
        {/* Inline Edit / Delete Buttons */}
        {isEditMode && (
          <div className={styles.editActions} onClick={e => e.stopPropagation()}>
            <button
              className={styles.editBtn}
              onClick={handleEdit}
              aria-label="Edit product"
              title="Edit product"
            >
              <Edit2 size={14} />
            </button>
            <button
              className={`${styles.deleteCardBtn} ${isDeleting ? styles.deleting : ""}`}
              onClick={handleDelete}
              aria-label="Delete product"
              title="Delete product"
              disabled={isDeleting}
            >
              <Trash2 size={14} />
            </button>
          </div>
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
            <span className={styles.currentPrice}>{settings.currencySymbol}{product.price}</span>
            {product.originalPrice && Number(product.originalPrice) !== Number(product.price) && (
              <span className={styles.oldPrice}>{settings.currencySymbol}{product.originalPrice}</span>
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
