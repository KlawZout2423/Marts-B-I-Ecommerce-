"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Heart, 
  Activity,
  UserPlus,
  Zap
} from "lucide-react";
import { Product } from "@/data/products";
import styles from "./Dashboard.module.css";
import { useStore } from "@/context/StoreContext";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// ── Animated counter hook ────────────────────────────────────────
function useCountUp(target: number, duration = 1200, active = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) { setCount(target); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, active]);
  return count;
}

// ── Single animated stat card ────────────────────────────────────
function StatCard({ icon, label, value, prefix = "", suffix = "", color, badge, delay = 0 }: any) {
  const [visible, setVisible] = useState(false);
  const animated = useCountUp(typeof value === 'number' ? value : 0, 1400, visible);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div 
      className={styles.statCard}
      style={{ 
        opacity: visible ? 1 : 0, 
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`
      }}
    >
      <div className={styles.statHeader}>
        <div className={`${styles.iconWrapper} ${styles[color]}`}>{icon}</div>
        {badge && (
          <span className={styles.liveBadge}>
            <span className={styles.liveDot} />
            {badge}
          </span>
        )}
      </div>
      <div className={styles.statValue}>
        {prefix}{animated.toLocaleString()}{suffix}
      </div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statProgress}>
        <div 
          className={styles.statProgressBar} 
          style={{ 
            width: visible ? `${Math.min((animated / (value || 1)) * 100, 100)}%` : '0%',
            transition: 'width 1.4s ease',
            background: color === 'green' ? '#10b981' : color === 'blue' ? '#0047AB' : color === 'purple' ? '#8b5cf6' : '#f59e0b'
          }} 
        />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [range, setRange] = useState(7);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalFavorites: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalMessages: 0,
    totalSubscribers: 0,
    dailySignups: [] as any[],
    topLoved: [] as any[]
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { settings } = useStore();

  useEffect(() => {
    setIsMounted(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) setProducts(data);
      });
    
    fetch("/api/admin/activity")
      .then(res => res.json())
      .then(data => setActivities(data));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/admin/stats?range=${range}`)
      .then((res) => res.json())
      .then((data: any) => {
        const chartData = data.chartLabels.map((label: string, i: number) => ({
          name: label,
          orders: data.dailySignups[i]
        }));
        
        setStats({
          totalProducts: data.totalProducts || 0,
          totalFavorites: data.totalFavorites || 0,
          totalUsers: data.totalUsers || 0,
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          totalMessages: data.totalMessages || 0,
          totalSubscribers: data.totalSubscribers || 0,
          dailySignups: chartData,
          topLoved: data.topLoved || []
        });
      })
      .finally(() => setIsLoading(false));
  }, [range]);

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'order': return <div className={`${styles.activityIcon}`} style={{ background: '#dcfce7', color: '#15803d' }}><ShoppingCart size={16} /></div>;
      case 'signup': return <div className={`${styles.activityIcon}`} style={{ background: '#e0f2fe', color: '#0369a1' }}><UserPlus size={16} /></div>;
      case 'favorite': return <div className={`${styles.activityIcon}`} style={{ background: '#fee2e2', color: '#ef4444' }}><Heart size={16} /></div>;
      default: return <div className={`${styles.activityIcon}`} style={{ background: '#f1f5f9', color: '#64748b' }}><Activity size={16} /></div>;
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Store Overview</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            Welcome back — MARTS B&amp;I is {activities.length > 0 ? '🟢 active' : '⚪ quiet'} right now.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 16px', borderRadius: '100px', border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
          <span className={styles.liveDot} style={{ width: '8px', height: '8px', background: '#22c55e' }} />
          Live Dashboard
        </div>
      </header>

      {/* 📊 Stat Cards with staggered animation */}
      <div className={styles.grid}>
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Total Revenue"
          value={stats.totalRevenue}
          prefix={settings.currencySymbol}
          color="green"
          badge="Live"
          delay={0}
        />
        <StatCard
          icon={<ShoppingCart size={20} />}
          label="Total Orders"
          value={stats.totalOrders}
          color="blue"
          badge="Orders"
          delay={100}
        />
        <StatCard
          icon={<Users size={20} />}
          label="Customers"
          value={stats.totalUsers}
          color="purple"
          badge="Growth"
          delay={200}
        />
        <StatCard
          icon={<Package size={20} />}
          label="Active Products"
          value={stats.totalProducts}
          color="orange"
          delay={300}
        />
      </div>

      <div className={styles.contentGrid}>
        {/* 📈 Chart */}
        <section className={`${styles.section} ${styles.analyticsSpan}`}>
          <div className={styles.sectionHeader}>
            <h2>Order Traffic</h2>
            <select 
              className={styles.dateSelector} 
              value={range} 
              onChange={(e) => setRange(parseInt(e.target.value))}
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>
          
          <div style={{ width: '100%', height: '250px', marginBottom: '24px', minHeight: '200px' }}>
            {isLoading || !isMounted ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div className={styles.spinnerBlue} />
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading analytics...</span>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={stats.dailySignups}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0047AB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0047AB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                  <Area type="monotone" dataKey="orders" stroke="#0047AB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrders)" dot={{ r: 4, fill: '#0047AB', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Avg. Order Value</span>
              <span className={styles.metricValue}>{settings.currencySymbol}{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : "0"}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Messages</span>
              <span className={styles.metricValue}>{stats.totalMessages}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Newsletter</span>
              <span className={styles.metricValue}>{stats.totalSubscribers}</span>
            </div>
          </div>
        </section>

        {/* 🛍️ Recent Products */}
        <section className={styles.section} style={{ animationDelay: '0.3s' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} color="#0047AB" /> Recent Products
          </h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((p, i) => (
                  <tr key={p.id} style={{ animation: `fadeSlideIn 0.4s ease ${i * 60}ms both` }}>
                    <td>
                      <div className={styles.productInfo}>
                        <img src={p.image} alt="" className={styles.productImage} />
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{settings.currencySymbol}{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ⚡ Live Activity */}
        <section className={styles.section}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#f59e0b" /> Live Activity
            <span className={styles.liveBadge} style={{ marginLeft: 'auto' }}>
              <span className={styles.liveDot} />
              {activities.length} events
            </span>
          </h2>
          <div className={styles.activitySidebar}>
            {activities.length > 0 ? (
              activities.map((act, i) => (
                <div 
                  key={act.id} 
                  className={styles.activityItem}
                  style={{ animation: `fadeSlideIn 0.4s ease ${i * 80}ms both` }}
                >
                  {getActivityIcon(act.type)}
                  <div className={styles.activityContent}>
                    <p className={styles.activityUser}>{act.user}</p>
                    <p className={styles.activityDetail}>{act.detail}</p>
                    <span className={styles.activityTime}>{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 20px' }}>
                <Activity size={32} style={{ opacity: 0.2, marginBottom: '8px' }} />
                <p style={{ fontSize: '13px' }}>No recent activity.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
