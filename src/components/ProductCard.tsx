"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Trash2 } from "lucide-react";
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
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, index = 0, className, onQuickView }: ProductCardProps) {
  const { addToCart, setIsOpen } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isEditMode } = useEditMode();
  const { settings } = useStore();
  const router = useRouter();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const gallery: string[] = Array.isArray((product as any).gallery) ? (product as any).gallery : [];
  const hasSecondary = gallery.length > 0;

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
        {/* Primary image */}
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className={`${styles.image} ${styles.primaryImage} ${hasSecondary ? styles.hasDualImage : ""}`}
        />

        {/* Secondary hover image (gallery[0]) */}
        {hasSecondary && (
          <Image
            src={(product as any).gallery[0]}
            alt={`${product.name} – alternate view`}
            width={400}
            height={400}
            className={styles.secondaryImage}
          />
        )}
        {/* Sale badge on image */}
        {product.originalPrice && Number(product.originalPrice) !== Number(product.price) && (
          <span className={styles.saleBadge}>Sale</span>
        )}

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

        {onQuickView && (
          <button 
            className={styles.quickViewBtn} 
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
          >
            Quick View
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

        {/* Price row: price + strikethrough + cart button */}
        <div className={styles.priceRow}>
          <div className={styles.pricing}>
            <span className={styles.currentPrice}>
              {settings.currencySymbol}{product.price}
            </span>
            {product.originalPrice && Number(product.originalPrice) !== Number(product.price) && (
              <span className={styles.oldPrice}>
                {settings.currencySymbol}{product.originalPrice}
              </span>
            )}
          </div>

          <button
            className={styles.roundCartBtn}
            onClick={handleQuickAdd}
            aria-label="Add to cart"
          >
            <ShoppingBag size={14} />
          </button>
        </div>

        {/* Sold count + stock progress bar + optional best-seller label */}
        <div className={styles.stockProgressArea}>
          {product.stock !== undefined && (
            <div className={styles.stockProgressContainer}>
              <div 
                className={`${styles.stockProgressBar} ${
                  product.stock <= 5 ? styles.stockBarRed : 
                  product.stock <= 10 ? styles.stockBarOrange : 
                  styles.stockBarGreen
                }`}
                style={{ width: `${Math.min(100, Math.max(10, (product.stock / 20) * 100))}%` }}
              />
            </div>
          )}
          <div className={styles.statsRow}>
            <span className={`${styles.soldCount} ${product.stock && product.stock <= 5 ? styles.limitedStockText : ""}`}>
              {product.stock && product.stock <= 5 ? `🔥 Only ${product.stock} left!` :
               product.stock && product.stock <= 10 ? `⚡ Selling fast! (${product.stock} left)` :
               `✨ ${product.stock || 0} in stock`}
            </span>
            {((product as any).placements?.includes("bestseller") || product.badge === "Best Seller") && (
              <span className={styles.bestSellerLabel}>Best Seller</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
