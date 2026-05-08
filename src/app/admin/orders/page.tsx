"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Download, Loader2, Package, CheckCircle2, Truck, Clock, XCircle, Trash2, CheckSquare, Square } from "lucide-react";
import styles from "../AdminPages.module.css";
import { toast } from "sonner";
import { useStore } from "@/context/StoreContext";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Orders");
  const { settings } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
    
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
        toast.success("Order deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        toast.success(`Order marked as ${status}`);
        if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Bulk Actions
  const handleBulkStatusUpdate = async (status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, status } : o));
        toast.success(`Updated ${selectedIds.length} orders to ${status}`);
        setSelectedIds([]);
      }
    } catch (err) {
      toast.error("Failed to perform bulk update");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} orders? This action is irreversible.`)) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds })
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => !selectedIds.includes(o.id)));
        toast.success(`Deleted ${selectedIds.length} orders`);
        setSelectedIds([]);
      }
    } catch (err) {
      toast.error("Failed to delete orders");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Orders" || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Delivered</span>;
      case 'shipped': return <span className={`${styles.badge} ${styles.badgeNeutral}`}>Shipped</span>;
      case 'pending': return <span className={`${styles.badge} ${styles.badgeWarning}`}>Pending</span>;
      case 'cancelled': return <span className={`${styles.badge} ${styles.badgeDanger}`}>Cancelled</span>;
      default: return <span className={`${styles.badge} ${styles.badgeNeutral}`}>{status}</span>;
    }
  };

  if (loading) return <div className="p-8">Loading orders...</div>;

  return (
    <div>
      <header className={styles.pageHeader}>
        <div>
          <h1>Order Management</h1>
          <p>Track WhatsApp orders, update statuses, and view customer details.</p>
        </div>
        <button className={styles.primaryBtn} style={{ background: 'white', color: '#0f172a', border: '1px solid #cbd5e1' }}>
          <Download size={18} /> Export List
        </button>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableToolbar}>
          <div className={styles.searchBar}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by order ID or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option>All Orders</option>
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <button 
                    onClick={toggleSelectAll} 
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: selectedIds.length > 0 ? '#0ea5e9' : '#cbd5e1' }}
                  >
                    {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                return (
                  <tr key={order.id} style={{ background: isSelected ? '#f0f9ff' : 'transparent' }}>
                    <td>
                      <button 
                        onClick={() => toggleSelectOrder(order.id)} 
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: isSelected ? '#0ea5e9' : '#cbd5e1' }}
                      >
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                    </td>
                    <td style={{ fontWeight: 700, color: '#0ea5e9' }}>{order.orderNumber}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{order.customerPhone}</div>
                    </td>
                    <td>{order.items?.length || 0} items</td>
                    <td style={{ fontWeight: 800 }}>{settings.currencySymbol}{Number(order.totalAmount).toFixed(2)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className={styles.iconBtn} onClick={() => setSelectedOrder(order)}>
                          <Eye size={18} />
                        </button>
                        <button className={styles.iconBtn} onClick={() => deleteOrder(order.id)} style={{ color: '#ef4444' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>
                    <Package size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p>No orders found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          background: '#0f172a', color: 'white', padding: '16px 24px', borderRadius: '16px',
          display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
          zIndex: 50, animation: 'slideUp 0.3s ease-out'
        }}>
          <span style={{ fontWeight: 600, borderRight: '1px solid #334155', paddingRight: '20px' }}>
            {selectedIds.length} selected
          </span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => handleBulkStatusUpdate('shipped')} style={{ background: '#334155', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Mark Shipped</button>
            <button onClick={() => handleBulkStatusUpdate('delivered')} style={{ background: '#334155', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Mark Delivered</button>
            <button onClick={handleBulkDelete} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Delete All</button>
          </div>
          <button onClick={() => setSelectedIds([])} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: '12px' }}><XCircle size={20} /></button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp { from { transform: translate(-50%, 100px); } to { transform: translate(-50%, 0); } }
      `}</style>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2>Order {selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><XCircle size={24} /></button>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Customer</h4>
                <p><strong>{selectedOrder.customerName}</strong></p>
                <p style={{ fontSize: '14px' }}>{selectedOrder.customerEmail}</p>
                <p style={{ fontSize: '14px' }}>{selectedOrder.customerPhone}</p>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Shipping Address</h4>
                <p style={{ fontSize: '14px' }}>{selectedOrder.shippingAddress}</p>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '16px' }}>Items Ordered</h4>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', padding: '12px', borderBottom: i === selectedOrder.items.length - 1 ? 'none' : '1px solid #e2e8f0', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '4px' }}>
                      {item.image && <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '14px' }}>{item.name}</p>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontWeight: 700 }}>{settings.currencySymbol}{Number(item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', textAlign: 'right', fontWeight: 800, fontSize: '20px' }}>
                Total: {settings.currencySymbol}{Number(selectedOrder.totalAmount).toFixed(2)}
              </div>
            </div>

            <div>
              <h4 style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '16px' }}>Update Status</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => updateStatus(selectedOrder.id, 'pending')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: selectedOrder.status === 'pending' ? '#fef3c7' : 'white', cursor: 'pointer' }}>Pending</button>
                <button onClick={() => updateStatus(selectedOrder.id, 'shipped')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: selectedOrder.status === 'shipped' ? '#e2e8f0' : 'white', cursor: 'pointer' }}>Shipped</button>
                <button onClick={() => updateStatus(selectedOrder.id, 'delivered')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: selectedOrder.status === 'delivered' ? '#dcfce7' : 'white', cursor: 'pointer' }}>Delivered</button>
                <button onClick={() => updateStatus(selectedOrder.id, 'cancelled')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: selectedOrder.status === 'cancelled' ? '#fee2e2' : 'white', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
