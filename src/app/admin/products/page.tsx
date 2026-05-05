"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, X, Image as ImageIcon, DollarSign, Package, UploadCloud, Check } from "lucide-react";
import styles from "../AdminPages.module.css";
import { Product, ProductPlacement } from "@/lib/cms-data";
import { useInventory } from "@/context/InventoryContext";

const PLACEMENT_OPTIONS: { id: ProductPlacement; label: string }[] = [
  { id: "homepage", label: "Show on Homepage" },
  { id: "new_arrivals", label: "New Arrival" },
  { id: "hot_sale", label: "Hot Sale" },
  { id: "featured", label: "Staff Featured" },
  { id: "bestseller", label: "Best Seller" },
];

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({ placements: [] });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: `PRD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: "",
      sku: "",
      price: "",
      stock: 0,
      image: "",
      placements: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: localUrl });
    }
  };

  const togglePlacement = (id: ProductPlacement) => {
    const current = formData.placements || [];
    if (current.includes(id)) {
      setFormData({ ...formData, placements: current.filter(p => p !== id) });
    } else {
      setFormData({ ...formData, placements: [...current, id] });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) return;

    const stockNum = Number(formData.stock) || 0;
    const status = stockNum === 0 ? "Out of Stock" : stockNum < 10 ? "Low Stock" : "In Stock";
    
    const finalProduct = { ...formData, status } as Product;

    if (editingProduct) {
      updateProduct(finalProduct);
    } else {
      addProduct(finalProduct);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <header className={styles.pageHeader}>
        <div>
          <h1>Inventory & Placement</h1>
          <p>Manage product catalog and their arrangement on your storefront.</p>
        </div>
        <button className={styles.primaryBtn} onClick={openAddModal}>
          <Plus size={18} /> Add Product
        </button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <div className={styles.searchBar}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search products by name or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Placements</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px',
                      backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center'
                    }}>
                      {!product.image && <ImageIcon size={20} color="#94a3b8" style={{ margin: '10px' }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{product.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{product.sku}</div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>${product.price}</td>
                  <td>{product.stock} units</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {product.placements?.map(p => (
                        <span key={p} className={styles.badge} style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '10px' }}>
                          {p.replace('_', ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className={styles.iconBtn} onClick={() => openEditModal(product)}><Edit size={16} /></button>
                      <button className={styles.iconBtn} style={{ color: '#ef4444' }} onClick={() => deleteProduct(product.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL (Same as before but using context) --- */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000
        }}>
          <div style={{
            width: '100%', maxWidth: '500px', background: 'white', height: '100%',
            padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editingProduct ? "Update Product" : "New Product"}</h2>
              <button className={styles.iconBtn} onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </header>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className={styles.inputGroup}>
                <label>Product Image</label>
                <div 
                  onClick={() => document.getElementById('fileInput')?.click()}
                  style={{ 
                    width: '100%', height: '180px', border: '2px dashed #cbd5e1', 
                    borderRadius: '12px', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    background: formData.image ? `url(${formData.image}) center/contain no-repeat` : '#f8fafc',
                    position: 'relative'
                  }}
                >
                  {!formData.image && <UploadCloud size={32} color="#94a3b8" />}
                </div>
                <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*" />
              </div>

              <div className={styles.inputGroup}><label>Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
              <div className={styles.inputGroup}>
                <label>Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Uncategorized">Select Category</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Toys">Toys</option>
                </select>
              </div>
              <div className={styles.inputGroup}><label>Price ($)</label><input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
              
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', display: 'block' }}>Storefront Arrangement</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {PLACEMENT_OPTIONS.map((opt) => {
                    const isSelected = formData.placements?.includes(opt.id);
                    return (
                      <div key={opt.id} onClick={() => togglePlacement(opt.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'white', border: `1px solid ${isSelected ? '#0ea5e9' : '#e2e8f0'}`, borderRadius: '8px', cursor: 'pointer' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: isSelected ? '#0ea5e9' : 'white', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isSelected && <Check size={12} color="white" />}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <footer style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              <button className={styles.primaryBtn} style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave}>Save</button>
              <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
            </footer>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
