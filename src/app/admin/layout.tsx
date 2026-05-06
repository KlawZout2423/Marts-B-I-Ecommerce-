"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  FileText, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  Image
} from "lucide-react";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Skip auth check if we are on the admin login page itself
    if (pathname === "/admin/login") return;

    if (!isPending) {
      console.log("Admin Auth Check:", { 
        hasSession: !!session, 
        userRole: (session?.user as any)?.role,
        fullSession: session 
      });

      if (!session?.user) {
        console.log("No session found, redirecting to login...");
        router.push("/admin/login");
      }
    }
  }, [session, isPending, router, pathname]);

  // If we are on the admin login page, just render the login page without the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isPending) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#64748b" }}>Verifying Admin Session...</div>;
  }

  if (!session?.user) {
    return null; // Handled by useEffect
  }

  // If logged in but NOT an admin, show a clear error instead of redirecting
  if ((session.user as any).role !== "admin") {
    return (
      <div style={{ 
        height: "100vh", display: "flex", flexDirection: "column", 
        alignItems: "center", justifyContent: "center", gap: "20px",
        padding: "20px", textAlign: "center", background: "#f8fafc"
      }}>
        <div style={{ padding: "20px", background: "#fee2e2", borderRadius: "50%", color: "#ef4444" }}>
          <LogOut size={40} />
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1e293b" }}>Access Denied</h1>
        <p style={{ color: "#64748b", maxWidth: "400px" }}>
          You are logged in as <strong>{session.user.email}</strong>, but you do not have administrative privileges.
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            onClick={() => authClient.signOut().then(() => router.push("/admin/login"))}
            style={{ padding: "10px 20px", background: "#0f172a", color: "white", borderRadius: "8px", fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Sign Out
          </button>
          <Link href="/" style={{ padding: "10px 20px", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#64748b", textDecoration: "none" }}>
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Inventory", href: "/admin/products", icon: <Package size={20} /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { name: "Content CMS", href: "/admin/content", icon: <FileText size={20} /> },
    { name: "Analytics", href: "/admin/analytics", icon: <TrendingUp size={20} /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className={styles.layout}>
      {/* ⬅️ Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoText}>MARTS <span>Admin</span></div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "AD"}
            </div>
            <div className={styles.userInfo}>
              <p>{session?.user?.name || "Admin"}</p>
              <span>Main Store</span>
            </div>
            <button 
              className={styles.logoutBtn} 
              title="Logout"
              onClick={async () => {
                await authClient.signOut();
                router.push("/login");
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ➡️ Main Content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
