"use client";

import { useEffect, useState } from "react";
import { Mail, Users, Check, MessageSquare, Download, Trash2, Eye, Inbox } from "lucide-react";
import styles from "../AdminPages.module.css";
import { toast } from "sonner";

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'messages' | 'subscribers'>('messages');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      const res = await fetch("/api/admin/inbox");
      const data = await res.json();
      setMessages(data.messages || []);
      setSubscribers(data.subscribers || []);
    } catch (err) {
      toast.error("Failed to load inbox data");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/admin/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "read" })
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
        toast.success("Message marked as read");
      }
    } catch (err) {
      toast.error("Failed to update message");
    }
  };

  const exportSubscribers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Date Joined\n"
      + subscribers.map(s => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `marts_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Subscriber list exported!");
  };

  if (isLoading) return <div className="p-8">Loading inbox...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Customer Inbox</h1>
          <p>Manage your communications and mailing lists.</p>
        </div>
        {activeTab === 'subscribers' && (
          <button className={styles.primaryBtn} onClick={exportSubscribers}>
            <Download size={18} /> Export List
          </button>
        )}
      </div>

      {/* KPI Overviews */}
      <div className={styles.grid}>
        <div className={styles.kpiCard}>
          <p className={styles.kpiTitle}><MessageSquare size={16} /> Total Messages</p>
          <h3 className={styles.kpiValue}>{messages.length}</h3>
          <p className={styles.kpiTrend}>{messages.filter(m => m.status === 'unread').length} Unread</p>
        </div>
        <div className={styles.kpiCard}>
          <p className={styles.kpiTitle}><Users size={16} /> Subscribers</p>
          <h3 className={styles.kpiValue}>{subscribers.length}</h3>
          <p className={styles.kpiTrend}>+ {subscribers.filter(s => new Date(s.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length} this week</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
        <button 
          onClick={() => setActiveTab('messages')}
          style={{ 
            padding: '12px 16px', 
            border: 'none', 
            background: 'none', 
            fontWeight: 700, 
            fontSize: '15px',
            color: activeTab === 'messages' ? '#0ea5e9' : '#64748b',
            borderBottom: activeTab === 'messages' ? '2px solid #0ea5e9' : 'none',
            cursor: 'pointer'
          }}
        >
          Contact Messages
        </button>
        <button 
          onClick={() => setActiveTab('subscribers')}
          style={{ 
            padding: '12px 16px', 
            border: 'none', 
            background: 'none', 
            fontWeight: 700, 
            fontSize: '15px',
            color: activeTab === 'subscribers' ? '#0ea5e9' : '#64748b',
            borderBottom: activeTab === 'subscribers' ? '2px solid #0ea5e9' : 'none',
            cursor: 'pointer'
          }}
        >
          Newsletter List
        </button>
      </div>

      {/* Content */}
      <div className={styles.tableCard}>
        {activeTab === 'messages' ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id} style={{ opacity: m.status === 'read' ? 0.7 : 1 }}>
                    <td style={{ minWidth: '200px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{m.email}</div>
                    </td>
                    <td style={{ maxWidth: '400px', whiteSpace: 'normal', lineHeight: '1.5' }}>
                      {m.message}
                    </td>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`${styles.badge} ${m.status === 'unread' ? styles.badgeWarning : styles.badgeNeutral}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {m.status === 'unread' && (
                          <button className={styles.iconBtn} onClick={() => markAsRead(m.id)} title="Mark as read">
                            <Check size={18} />
                          </button>
                        )}
                        <button className={styles.iconBtn} title="Delete Message">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                      <Inbox size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                      <p>Your inbox is empty. New messages will appear here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Subscriber Email</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.email}</div>
                    </td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeSuccess}`}>Active</span>
                    </td>
                    <td>
                      <button className={styles.iconBtn} title="Remove Subscriber">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                      <Users size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                      <p>No subscribers yet. They will appear here when people use the footer form.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
