"use client";

import LivePurchaseNotification from "./LivePurchaseNotification";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      {children}
      <LivePurchaseNotification />
    </div>
  );
}
