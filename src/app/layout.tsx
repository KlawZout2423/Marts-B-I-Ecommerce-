import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import CartSidebar from "@/components/CartSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { EditModeProvider } from "@/context/EditModeContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { StoreProvider } from "@/context/StoreContext";
import VisualSaveBar from "@/components/VisualSaveBar";



export const metadata: Metadata = {
  title: "MARTS | Business & Imports",
  description: "The Sound of Experience. Global imports delivered locally.",
  icons: {
    icon: "/logo.png",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" richColors />
        <StoreProvider>
          <CartProvider>
            <FavoritesProvider>
              <InventoryProvider>
                <EditModeProvider>
                  {children}
                  <CartSidebar />
                  <MobileBottomNav />
                  <VisualSaveBar />
                </EditModeProvider>
              </InventoryProvider>
            </FavoritesProvider>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
