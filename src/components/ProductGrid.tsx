"use client";

import { useEffect, useState, Fragment } from "react";
import { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { useEditMode } from "@/context/EditModeContext";
import { useInventory } from "@/context/InventoryContext";
import { usePathname } from "next/navigation";
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
  rows?: number;
  onQuickView?: (product: Product) => void;
  showPromoCard?: boolean;
}

export default function ProductGrid({
  title,
  filterTag,
  limit,
  products: initialProducts,
  isLoading: initialLoading,
  emptyMessage = "No products found.",
  variant = "masonry",
  isCarouselOnMobile = false,
  rows = 1,
  onQuickView,
  showPromoCard = false
}: ProductGridProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { isEditMode } = useEditMode();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
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
    const processProducts = (data: any[]) => {
      let filtered = data;

      if (filterTag) {
        if (filterTag === "new" || filterTag === "new_arrivals") {
          // 30-Day Auto-Expiry Logic matching ShopClient:
          const taggedNew = data.filter(p => {
            try {
              const placements = p.placements || [];
              if (!placements.includes("new_arrivals") && !placements.includes("new")) return false;
              
              const createdDate = new Date(p.createdAt);
              const diffDays = Math.ceil(Math.abs(Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
              
              return diffDays <= 30; 
            } catch { return false; }
          });

          if (taggedNew.length > 0) {
            filtered = taggedNew;
          } else {
            // Fallback: sort by date desc
            filtered = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }
        } else {
          filtered = data.filter((p: any) => {
            // Priority 1: Check the placements array (from DB)
            if (p.placements && Array.isArray(p.placements)) {
              if (p.placements.includes(filterTag)) return true;
            }

            // Priority 2: Fallback to legacy hardcoded logic
            if (filterTag === "bestseller") {
              return (p.rating && p.rating >= 4.7) || p.badge === "Best Seller";
            } else if (filterTag === "featured") {
              return p.badge === "Best Seller" || p.id === "4";
            } else if (filterTag === "hot_sale") {
              return p.originalPrice || p.id === "1";
            }
            
            return true;
          });
        }
      }

      if (limit) filtered = filtered.slice(0, limit);
      setProducts(filtered);
      setLoading(false);
    };

    if (initialProducts) {
      processProducts(initialProducts);
      return;
    }

    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("API returned non-array data:", data);
          setProducts([]);
          setLoading(false);
          return;
        }
        processProducts(data);
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
              <h2 className={styles.title}>{title}</h2>
            </div>
          )}
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.section} ${filterTag === "new" || filterTag === "new_arrivals" ? styles.newArrivalsSection : ""}`}>
      <div className={`${styles.container} container`}>
        {title && (
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h2 className={styles.title}>{title}</h2>
              {filterTag && (
                <span className={styles.titleTag}>
                  {filterTag === "new" || filterTag === "new_arrivals" ? "✦ Just dropped" :
                   filterTag === "bestseller" ? "✦ Top picks" :
                   filterTag === "hot_sale" ? "✦ Limited time" :
                   filterTag === "featured" ? "✦ Curated for you" : ""}
                </span>
              )}
            </div>
            <div className={styles.headerRight}>
              {isEditMode && (
                <button
                  className={styles.titleAddBtn}
                  onClick={() => setIsAddModalOpen(true)}
                  title="Add product to this section"
                >
                  <Plus size={20} />
                </button>
              )}
              {/* View all link removed to keep everything on the homepage like Temu */}
            </div>
          </div>
        )}

        {products.length > 0 ? (
          <div className={`
            ${isCarouselOnMobile ? styles.carouselContainer : styles.grid} 
            ${variant === "grid" && !isCarouselOnMobile ? styles.standardGrid : ""} 
          `}>
            {isCarouselOnMobile && isMobile ? (
              <div 
                className={styles.carousel}
                style={{
                  gridTemplateRows: `repeat(${rows}, minmax(max-content, 1fr))`,
                  gridAutoFlow: "column"
                }}
              >
                {products.map((product, index) => (
                  <div key={product.id} className={styles.carouselItem}>
                    <ProductCard product={product} index={index} onQuickView={onQuickView} />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {products.map((product, index) => (
                  <Fragment key={product.id}>
                    {index === 3 && showPromoCard && (
                      <div className={styles.promoGridCard}>
                        <div className={styles.promoCardContent}>
                          <span className={styles.promoTag}>LIMITED DROP</span>
                          <h3>Direct Sourcing, Unmatched Value</h3>
                          <p>We cut out intermediate importers to save you up to 45% on global collections.</p>
                          <div className={styles.promoCode}>
                            <span>Use Code:</span>
                            <strong>MARTS10</strong>
                          </div>
                        </div>
                      </div>
                    )}
                    <ProductCard product={product} index={index} onQuickView={onQuickView} />
                  </Fragment>
                ))}
              </>
            )}

            {isEditMode && !isCarouselOnMobile && (
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
