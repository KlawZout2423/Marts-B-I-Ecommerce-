"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Image as ImageIcon, Sparkles, ShoppingCart, Info } from "lucide-react";
import { useEditMode } from "@/context/EditModeContext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import styles from "./ShopTheLook.module.css";
import { toast } from "sonner";

interface Hotspot {
  id: string;
  nameKey: string; // string key to look up product
  fallbackName: string;
  fallbackPrice: string;
  fallbackImage: string;
  top: string;
  left: string;
}

const DEFAULT_HOTSPOTS: Hotspot[] = [
  {
    id: "hotspot-sofa",
    nameKey: "sofa",
    fallbackName: "Modern Leather Sofa",
    fallbackPrice: "1299.99",
    fallbackImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    top: "55%",
    left: "45%",
  },
  {
    id: "hotspot-table",
    nameKey: "table",
    fallbackName: "Minimalist Coffee Table",
    fallbackPrice: "249.50",
    fallbackImage: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80",
    top: "70%",
    left: "30%",
  },
  {
    id: "hotspot-lamp",
    nameKey: "lamp",
    fallbackName: "Industrial Floor Lamp",
    fallbackPrice: "125.00",
    fallbackImage: "https://images.unsplash.com/photo-1507473885765-e6ed657f9971?w=800&q=80",
    top: "35%",
    left: "80%",
  },
];

interface ShopTheLookContent {
  title: string;
  subtitle: string;
  image: string;
}

interface ShopTheLookProps {
  id: string;
  content?: Partial<ShopTheLookContent>;
}

export default function ShopTheLook({ id, content: passedContent }: ShopTheLookProps) {
  const content = {
    title: "Shop the Look",
    subtitle: "Hover over the glowing pulsing hotspots in this premium interior showcase to discover and buy products directly.",
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2000&auto=format&fit=crop",
    ...passedContent,
  };

  const { isEditMode, updateBlockContent } = useEditMode();
  const { addToCart, setIsOpen: setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch active products to link hotspots to live database entries
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Error loading products for hotspots:", err));
  }, []);

  // Close popup card on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveHotspot(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleTextUpdate = (field: keyof ShopTheLookContent, text: string) => {
    updateBlockContent(id, { [field]: text });
  };

  const handleSelectImage = () => {
    const url = prompt("Enter lifestyle showcase image URL:", content.image);
    if (url) {
      updateBlockContent(id, { image: url });
    }
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    setIsCartOpen(true);
    toast.success(`Added ${product.name} to Cart!`);
    setActiveHotspot(null);
  };

  // Find dynamic product matching a hotspot key
  const getProductForHotspot = (hotspot: Hotspot): Product => {
    const found = products.find((p) =>
      p.name.toLowerCase().includes(hotspot.nameKey.toLowerCase())
    );

    if (found) return found;

    // Return mockup product if not found in db
    return {
      id: hotspot.id,
      name: hotspot.fallbackName,
      price: hotspot.fallbackPrice,
      image: hotspot.fallbackImage,
      category: "Living Room",
      sku: hotspot.id,
      stock: 10,
      status: "active",
      tags: [],
    } as any;
  };

  return (
    <section className={styles.section}>
      <div className={`${styles.container} container`} ref={containerRef}>
        <div className={styles.header}>
          <h2
            className={`${styles.title} ${isEditMode ? styles.editable : ""}`}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextUpdate("title", e.currentTarget.textContent || "")}
          >
            {content.title}
          </h2>
          <p
            className={`${styles.subtitle} ${isEditMode ? styles.editable : ""}`}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => handleTextUpdate("subtitle", e.currentTarget.textContent || "")}
          >
            {content.subtitle}
          </p>
        </div>

        <div
          className={styles.visualCanvas}
          style={{ backgroundImage: `url(${content.image})` }}
        >
          {isEditMode && (
            <button
              className={styles.editImageBtn}
              onClick={handleSelectImage}
              title="Change lifestyle showcase image"
            >
              <ImageIcon size={18} color="#0047AB" />
            </button>
          )}

          {DEFAULT_HOTSPOTS.map((hotspot) => {
            const product = getProductForHotspot(hotspot);
            const isOpen = activeHotspot === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className={styles.hotspotPin}
                style={{ top: hotspot.top, left: hotspot.left }}
                onMouseEnter={() => !isEditMode && setActiveHotspot(hotspot.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(isOpen ? null : hotspot.id);
                }}
              >
                <div className={styles.hotspotDot} />
                <div className={styles.hotspotRipple} />

                {isOpen && (
                  <div
                    className={styles.popupCard}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.popupThumb}>
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className={styles.popupInfo}>
                      <Link href={`/products/${product.id}`} className={styles.popupName}>
                        {product.name}
                      </Link>
                      <span className={styles.popupPrice}>${product.price}</span>
                      <div className={styles.popupActions}>
                        <button
                          className={styles.quickAddBtn}
                          onClick={(e) => handleQuickAdd(product, e)}
                        >
                          + Add to Cart
                        </button>
                        <Link href={`/products/${product.id}`} className={styles.viewBtn}>
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
