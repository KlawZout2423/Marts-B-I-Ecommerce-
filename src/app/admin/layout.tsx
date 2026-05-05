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
      if (!session?.user || (session.user as any).role !== "admin") {
        router.push("/admin/login");
      }
    }
  }, [session, isPending, router, pathname]);

  // If we are on the admin login page, just render the login page without the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isPending || !session?.user || (session.user as any).role !== "admin") {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>;
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
