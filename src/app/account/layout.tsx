"use client";

import React from "react";
import styles from "./account.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  MapPin, 
  CreditCard,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.info("You have been successfully logged out.");
    router.push("/login");
  };

  if (!session) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Verifying your session...</p>
      </div>
    );
  }

  const user = session.user;

  const navItems = [
    { name: "Dashboard", href: "/account", icon: LayoutDashboard },
    { name: "My Orders", href: "/account/orders", icon: ShoppingBag },
    { name: "Wishlist", href: "/account/wishlist", icon: Heart },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Payments", href: "/account/payments", icon: CreditCard },
    { name: "Settings", href: "/account/settings", icon: Settings },
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <Link href="/" className={styles.backHomeLink}>
              <ArrowLeft size={16} /> Return to Store
            </Link>
            <h1 className={styles.title}>Your Account</h1>
            <p className={styles.subtitle}>Manage your premium orders and profile</p>
          </div>
          <div className={styles.userBadge}>
            <div className={styles.badgeAvatar}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.badgeInfo}>
              <span className={styles.badgeName}>{user.name}</span>
              <span className={styles.badgeStatus}>Premium Member</span>
            </div>
          </div>
        </header>

        <div className={styles.dashboardLayout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <nav className={styles.nav}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={isActive ? styles.navLinkActive : styles.navLink}
                  >
                    <Icon size={20} /> {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className={styles.sidebarDivider} />
            
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={20} /> Sign Out
            </button>
          </aside>

          {/* Main Content Area */}
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
