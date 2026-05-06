"use client";

import { useEffect, useState } from "react";
import { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { useEditMode } from "@/context/EditModeContext";
import { useInventory } from "@/context/InventoryContext";
import { Plus, X, UploadCloud, Check } from "lucide-react";
import styles from "./ProductGrid.module.css";

interface ProductGridProps {
  title?: string;
  filterTag?: "bestseller" | "new" | "new_arrivals" | "featured" | "hot_sale";
  limit?: number;
  products?: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  variant?: "masonry" | "grid";
  isCarouselOnMobile?: boolean;
}

export default function ProductGrid({
  title,
  filterTag,
  limit,
  products: initialProducts,
  isLoading: initialLoading,
  emptyMessage = "No products found.",
  variant = "masonry",
  isCarouselOnMobile = false
}: ProductGridProps) {
  const { isEditMode } = useEditMode();
  const { addProduct } = useInventory();
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(initialLoading ?? !initialProducts);
  
  // Quick Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    stock: 20,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: "Unisex",
    placements: []
  });

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
      setLoading(false);
      return;
    }

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("API returned non-array data:", data);
          setProducts([]);
          setLoading(false);
          return;
        }

        let filtered = data;

        if (filterTag) {
          filtered = data.filter((p: any) => {
            // Priority 1: Check the placements array (from DB)
            if (p.placements && Array.isArray(p.placements)) {
              if (p.placements.includes(filterTag)) return true;
              // Handle "new" vs "new_arrivals" mapping
              if (filterTag === "new" && p.placements.includes("new_arrivals")) return true;
            }

            // Priority 2: Fallback to legacy hardcoded logic
            if (filterTag === "bestseller") {
              return (p.rating && p.rating >= 4.7) || p.badge === "Best Seller";
            } else if (filterTag === "new" || filterTag === "new_arrivals") {
              return p.badge === "New" || p.id === "2" || p.id === "3";
            } else if (filterTag === "featured") {
              return p.badge === "Best Seller" || p.id === "4";
            } else if (filterTag === "hot_sale") {
              return p.originalPrice || p.id === "1";
            }
            
            return true;
          });
        }

        if (limit) filtered = filtered.slice(0, limit);
        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, [filterTag, limit, initialProducts]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickAdd = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    const id = `PRD-${Math.floor(Math.random() * 10000)}`;
    const productToAdd = {
      ...newProduct,
      id,
      sku: id,
      status: "In Stock"
    } as any;
    
    addProduct(productToAdd);
    setProducts([productToAdd, ...products]);
    setIsAddModalOpen(false);
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={`${styles.container} container`}>
          {title && (
            <div className={styles.header}>
              <div className={styles.divider} />
              <h2 className={styles.title}>{title}</h2>
              <div className={styles.divider} />
            </div>
          )}
          <div className={styles.grid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={`${styles.container} container`}>
        {title && (
          <div className={styles.header}>
            <div className={styles.divider} />
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.divider} />
          </div>
        )}

        {products.length > 0 ? (
          <div className={`
            ${styles.grid} 
            ${variant === "grid" ? styles.standardGrid : ""} 
            ${isCarouselOnMobile ? styles.carousel : ""}
          `}>
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}

            {isEditMode && (
              <div 
                className={styles.addCard} 
                onClick={() => setIsAddModalOpen(true)}
              >
                <div className={styles.plusIcon}>
                  <Plus size={32} />
                </div>
                <span>Add New Product</span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>

      {/* Quick Add Modal */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <header className={styles.modalHeader}>
              <h3>Quick Add Product</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
            </header>
            
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label htmlFor="quick-add-name">Product Name</label>
                <input 
                  id="quick-add-name"
                  name="product-name"
                  type="text" 
                  placeholder="e.g. Summer Dress" 
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="quick-add-price">Price ($)</label>
                <input 
                  id="quick-add-price"
                  name="product-price"
                  type="number" 
                  placeholder="0.00" 
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Product Image</label>
                <div 
                  className={styles.imageUploadArea}
                  onClick={() => document.getElementById('quick-add-file')?.click()}
                  style={{ 
                    width: '100%', height: '150px', border: '2px dashed #cbd5e1', 
                    borderRadius: '12px', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    background: newProduct.image ? `url(${newProduct.image}) center/contain no-repeat` : '#f8fafc',
                    position: 'relative', overflow: 'hidden'
                  }}
                >
                  {!newProduct.image && (
                    <>
                      <UploadCloud size={32} color="#94a3b8" />
                      <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Click to Upload</span>
                    </>
                  )}
                  <input 
                    id="quick-add-file" 
                    type="file" 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="quick-add-category">Category</label>
                <select 
                  id="quick-add-category"
                  name="product-category"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className={styles.select}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                >
                  <option value="Fashion">Fashion</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Toys">Toys</option>
                  <option value="Books">Books</option>
                </select>
              </div>
              <div className={styles.badgeSelection}>
                <label>Featured Tags</label>
                <div className={styles.badgeList}>
                  {["new_arrivals", "hot_sale", "bestseller"].map(tag => {
                    const isSelected = newProduct.placements?.includes(tag as any);
                    return (
                      <button 
                        key={tag}
                        className={`${styles.tagBtn} ${isSelected ? styles.tagBtnActive : ""}`}
                        onClick={() => {
                          const current = newProduct.placements || [];
                          if (isSelected) {
                            setNewProduct({...newProduct, placements: current.filter(p => p !== tag)});
                          } else {
                            setNewProduct({...newProduct, placements: [...current, tag as any]});
                          }
                        }}
                      >
                        {tag.replace('_', ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <footer className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleQuickAdd}>Save & Publish</button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}
