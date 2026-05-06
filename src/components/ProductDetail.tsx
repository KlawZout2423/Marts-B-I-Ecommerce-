"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, ArrowLeft, Check, Star, Shield, Truck, RotateCcw, TrendingUp, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import styles from "./ProductDetail.module.css";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart, setIsOpen } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'highlights' | 'specs'>('highlights');

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setIsOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.container} container`}>

        <Link href="/shop" className={styles.back}>
          <ArrowLeft size={18} /> Back to Catalog
        </Link>

        <div className={styles.grid}>

          {/* Image Section */}
          <motion.div 
            className={styles.imageSection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.imageBox}>
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={800}
                className={styles.image}
                priority
              />
            </div>
            
            {/* Thumbnails */}
            <div className={styles.thumbnailRow}>
              {[product.image, product.image, product.image, product.image].map((img, i) => (
                <div key={i} className={`${styles.thumb} ${i === 0 ? styles.activeThumb : ''}`}>
                  <Image src={img} alt="thumbnail" width={80} height={80} />
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <Shield size={18} />
                <span>Original</span>
              </div>
              <div className={styles.trustItem}>
                <Truck size={18} />
                <span>Ready Stock</span>
              </div>
              <div className={styles.trustItem}>
                <RotateCcw size={18} />
                <span>7 Day Warranty</span>
              </div>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div 
            className={styles.infoSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.headerRow}>
              <span className={styles.officialBadge}>
                <Shield size={12} fill="white" /> Official Store
              </span>
            </div>
            
            <h1 className={styles.name}>{product.name}</h1>
            
            <div className={styles.ratingRow}>
              <div className={styles.ratingBox}>
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <span className={styles.ratingVal}>{product.rating}</span>
                <span className={styles.ratingCount}>({product.reviewCount} reviews)</span>
              </div>
              <span className={styles.dot}>•</span>
              <span className={styles.discussion}>0 Discussion</span>
            </div>

            <div className={styles.priceContainer}>
              {product.originalPrice && (
                <span className={styles.oldPrice}>${product.originalPrice}</span>
              )}
              <div className={styles.mainPrice}>${product.price}</div>
              {product.originalPrice && (
                <span className={styles.discountBadge}>
                  {Math.round((1 - Number(product.price)/Number(product.originalPrice)) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Variants */}
            <div className={styles.variantSection}>
              <h4 className={styles.variantTitle}>Color</h4>
              <div className={styles.variantGrid}>
                {['Olive', 'Salem', 'Yellow'].map(color => (
                  <button key={color} className={`${styles.variantBtn} ${color === 'Yellow' ? styles.activeVariant : ''}`}>
                    <div className={styles.colorCircle} style={{ background: color.toLowerCase() }} />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.variantSection}>
              <h4 className={styles.variantTitle}>Size</h4>
              <div className={styles.variantGrid}>
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button key={size} className={`${styles.variantBtn} ${size === 'M' ? styles.activeVariant : ''}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Box */}
            <div className={styles.promoCard}>
              <div className={styles.promoText}>
                <p className={styles.promoHeading}>Extra Discount Today</p>
                <p className={styles.promoSub}>Use code: MARTS2024</p>
              </div>
              <ChevronRight size={20} color="#16a34a" />
            </div>

            <div className={styles.buyBox}>
              <div className={styles.qtyRow}>
                <span className={styles.qtyLabel}>Quantity:</span>
                <div className={styles.qtyControls}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className={styles.qtyBtn}>−</button>
                  <span className={styles.qty}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className={styles.qtyBtn}>+</button>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className={`${styles.addBtn} ${added ? styles.added : ""}`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={20} />
                  {added ? "Added!" : "Add to Cart"}
                </button>
                <button className={styles.wishBtn}>
                  <Heart size={20} />
                </button>
              </div>
            </div>

            {/* Details Table */}
            <div className={styles.detailsSection}>
              <div className={styles.detailsHeader}>
                <button className={styles.detailTabActive}>Details</button>
                <button className={styles.detailTab}>Reviews</button>
                <button className={styles.detailTab}>Shipping</button>
              </div>

              <div className={styles.detailsContent}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Weight</span>
                    <span className={styles.infoVal}>350 gram</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Condition</span>
                    <span className={styles.infoVal}>New</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoKey}>Category</span>
                    <span className={styles.infoVal}>{product.category}</span>
                  </div>
                </div>

                <div className={styles.descriptionText}>
                  <h4 className={styles.descTitle}>Description</h4>
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
