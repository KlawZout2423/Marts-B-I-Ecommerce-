"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, ArrowLeft, Shield, Truck, RotateCcw, Star, ChevronRight, CheckCircle2 } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import styles from "./ProductDetail.module.css";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart, setIsOpen } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { settings } = useStore();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details');
  const [selectedPack, setSelectedPack] = useState('Standard Edition');
  const [selectedColor, setSelectedColor] = useState('Sleek Charcoal');
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 35 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 6);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setIsOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isFav = isFavorite(product.id);

  return (
    <div className={styles.page}>
      <div className={`${styles.container} container`}>

        <Link href="/shop" className={styles.back}>
          <ArrowLeft size={18} /> Back to Catalog
        </Link>

        <div className={styles.grid}>

          {/* 🖼️ Image Section */}
          <motion.div 
            className={styles.imageSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
            
            {/* Thumbnails (Mocked for now) */}
            <div className={styles.thumbnailRow}>
              {[product.image, product.image, product.image].map((img, i) => (
                <div key={i} className={`${styles.thumb} ${i === 0 ? styles.activeThumb : ''}`}>
                  <Image src={img} alt="thumbnail" width={80} height={80} />
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <Shield size={20} />
                <span>Premium Quality</span>
              </div>
              <div className={styles.trustItem}>
                <Truck size={20} />
                <span>Global Shipping</span>
              </div>
              <div className={styles.trustItem}>
                <RotateCcw size={20} />
                <span>Easy Returns</span>
              </div>
            </div>
          </motion.div>

          {/* 📋 Info Section */}
          <motion.div 
            className={styles.infoSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className={styles.headerRow}>
              <span className={styles.officialBadge}>
                <Shield size={12} fill="currentColor" /> Authentic Import
              </span>
            </div>
            
            <h1 className={styles.name}>{product.name}</h1>
            
            <div className={styles.ratingRow}>
              <div className={styles.ratingBox}>
                <Star size={14} fill="currentColor" />
                <span className={styles.ratingVal}>{product.rating || 4.8}</span>
              </div>
              <span className={styles.ratingCount}>{product.reviewCount || 12} Verified Reviews</span>
            </div>

            <div className={styles.priceContainer}>
              <div className={styles.mainPrice}>{settings.currencySymbol}{product.price}</div>
              {product.originalPrice && (
                <>
                  <span className={styles.oldPrice}>{settings.currencySymbol}{product.originalPrice}</span>
                  <span className={styles.discountBadge}>
                    {Math.round((1 - Number(product.price)/Number(product.originalPrice)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Product Variants (Cohesive & Tactile Look) */}
            <div className={styles.variantSection}>
              <h4 className={styles.variantTitle}>Select Pack</h4>
              <div className={styles.variantGrid}>
                {['Standard Edition', 'Premium Pack'].map(opt => (
                  <button 
                    key={opt} 
                    className={`${styles.variantBtn} ${selectedPack === opt ? styles.activeVariant : ''}`}
                    onClick={() => setSelectedPack(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.variantSection}>
              <h4 className={styles.variantTitle}>Select Finish</h4>
              <div className={styles.colorSwatchList}>
                {[
                  { name: 'Sleek Charcoal', hex: '#1e293b' },
                  { name: 'Ocean Blue', hex: '#0047AB' },
                  { name: 'Royal Gold', hex: '#d97706' }
                ].map(col => (
                  <button 
                    key={col.name}
                    className={`${styles.colorSwatchBtn} ${selectedColor === col.name ? styles.colorSwatchBtnActive : ''}`}
                    onClick={() => setSelectedColor(col.name)}
                    title={col.name}
                  >
                    <span className={styles.colorSwatchDot} style={{ backgroundColor: col.hex }} />
                    <span className={styles.colorSwatchName}>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 🚚 Shipping Estimator Widget */}
            <div className={styles.deliveryWidget}>
              <div className={styles.deliveryStatusRow}>
                <Truck size={16} className={styles.deliveryTruckIcon} />
                <span>Express Sourced Import Delivery</span>
              </div>
              <div className={styles.deliveryDetailText}>
                Get it by <strong>{getDeliveryDate()}</strong> if you order within the next <strong>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</strong>!
              </div>
            </div>

            {/* 🛒 Purchase Box */}
            <div className={styles.buyBox}>
              <div className={styles.qtyRow}>
                <span className={styles.qtyLabel}>Quantity</span>
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
                  {added ? "Added to Cart!" : "Add to Cart"}
                </button>
                <button 
                  className={`${styles.wishBtn} ${isFav ? styles.wishActive : ""}`}
                  onClick={() => toggleFavorite(product.id)}
                  title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart size={24} fill={isFav ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Trust Checkpoints */}
            <div className={styles.trustCheckpoints}>
              <div className={styles.trustCheckItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>Free express shipping on all orders over $50</span>
              </div>
              <div className={styles.trustCheckItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>Certified source verification & sourcing logs</span>
              </div>
              <div className={styles.trustCheckItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>30-day money-back satisfaction guarantee</span>
              </div>
            </div>

            {/* 📖 Tabs Section */}
            <div className={styles.detailsSection}>
              <div className={styles.detailsHeader}>
                <button 
                  className={`${styles.detailTab} ${activeTab === 'details' ? styles.detailTabActive : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Product Details
                </button>
                <button 
                  className={`${styles.detailTab} ${activeTab === 'reviews' ? styles.detailTabActive : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Specifications
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={styles.detailsContent}
                >
                  {activeTab === 'details' ? (
                    <div className={styles.descriptionText}>
                      <p>{product.description}</p>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                          <span className={styles.infoKey}>Category</span>
                          <span className={styles.infoVal}>{product.category}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoKey}>SKU</span>
                          <span className={styles.infoVal}>{product.sku || 'MRT-PRM-001'}</span>
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoKey}>Shipping</span>
                          <span className={styles.infoVal}>Calculated at checkout</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.specsText}>
                      <div className={styles.infoGrid}>
                        {Object.entries(product.specs || {}).map(([key, val]: [string, any]) => (
                          <div key={key} className={styles.infoRow}>
                            <span className={styles.infoKey}>{key}</span>
                            <span className={styles.infoVal}>{String(val)}</span>
                          </div>
                        ))}
                        {Object.entries(product.specs || {}).length === 0 && (
                          <p style={{ color: '#94a3b8' }}>No detailed specifications available for this model.</p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
