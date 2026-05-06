"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, ArrowLeft, Check, Star, Shield, Truck, RotateCcw } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import styles from "./ProductDetail.module.css";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart, setIsOpen } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

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

          {/* Image */}
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
            
            {/* Trust Badges below image */}
            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <Shield size={20} className={styles.trustIcon} />
                <span>2 Year Warranty</span>
              </div>
              <div className={styles.trustItem}>
                <Truck size={20} className={styles.trustIcon} />
                <span>Express Shipping</span>
              </div>
              <div className={styles.trustItem}>
                <RotateCcw size={20} className={styles.trustIcon} />
                <span>30-Day Returns</span>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div 
            className={styles.infoSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.category}>{product.category}</span>
            <h1 className={styles.name}>{product.name}</h1>
            
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating || 0) ? "var(--accent)" : "none"}
                    color={i < Math.floor(product.rating || 0) ? "var(--accent)" : "var(--border)"}
                  />
                ))}
              </div>
              <span className={styles.reviewCount}>{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className={styles.price}>${product.price}</div>

            <p className={styles.description}>{product.description}</p>

            {/* Features */}
            <div className={styles.features}>
              <h4 className={styles.sectionTitle}>Highlights</h4>
              <div className={styles.featureGrid}>
                {Array.isArray(product.features) && product.features.length > 0 ? (
                  product.features.map((f, i) => (
                    <div key={i} className={styles.featureItem}>
                      <Check size={18} className={styles.check} />
                      <span>{f}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>No highlights listed.</p>
                )}
              </div>
            </div>

            <div className={styles.buyBox}>
              {/* Quantity */}
              <div className={styles.qtyRow}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} className={styles.qtyBtn}>−</button>
                <span className={styles.qty}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} className={styles.qtyBtn}>+</button>
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  className={`${styles.addBtn} ${added ? styles.added : ""}`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={20} />
                  {added ? "Added to Cart!" : "Add to Cart"}
                </button>
                <button className={styles.wishBtn} aria-label="Add to favorites">
                  <Heart size={20} />
                </button>
              </div>
            </div>

            {/* Specs */}
            <div className={styles.specs}>
              <h4 className={styles.sectionTitle}>Specifications</h4>
              <div className={styles.specsList}>
                {product.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0 ? (
                  Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className={styles.specRow}>
                      <span className={styles.specKey}>{key}</span>
                      <span className={styles.specVal}>{val}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>Specifications not provided.</p>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
