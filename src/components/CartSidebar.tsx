"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import styles from "./CartSidebar.module.css";

export default function CartSidebar() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            className={styles.sidebar}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <div className={styles.titleWrapper}>
                <ShoppingBag size={20} />
                <h2>Your Cart ({totalItems})</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className={styles.progressSection}>
              {totalPrice >= 100 ? (
                <p className={styles.progressText}>✨ You've unlocked <strong>Free Shipping!</strong></p>
              ) : (
                <p className={styles.progressText}>
                  Spend <strong>${(100 - totalPrice).toFixed(2)}</strong> more for free shipping
                </p>
              )}
              <div className={styles.progressBar}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalPrice / 100) * 100, 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className={styles.items}>
              {cart.length === 0 ? (
                <div className={styles.empty}>
                  <p>Your cart is empty</p>
                  <button onClick={() => setIsOpen(false)} className={styles.shopBtn}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemImage}>
                      <Image src={item.image} alt={item.name} width={80} height={80} />
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemHeader}>
                        <h3>{item.name}</h3>
                        <span className={styles.itemPrice}>${item.price}</span>
                      </div>
                      <div className={styles.itemActions}>
                        <div className={styles.quantity}>
                          <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className={styles.removeBtn}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotal}>
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <p className={styles.taxNote}>Shipping and taxes calculated at checkout.</p>
                <Link 
                  href="/checkout" 
                  className={styles.checkoutBtn}
                  onClick={() => setIsOpen(false)}
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
