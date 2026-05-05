import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import CartSidebar from "@/components/CartSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { EditModeProvider } from "@/context/EditModeContext";
import { InventoryProvider } from "@/context/InventoryContext";
import VisualSaveBar from "@/components/VisualSaveBar";
import BackButton from "@/components/BackButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MARTS | Business & Imports",
  description: "The Sound of Experience. Global imports delivered locally.",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Toaster position="top-center" richColors />
        <CartProvider>
          <FavoritesProvider>
            <InventoryProvider>
              <EditModeProvider>
                {children}
                <CartSidebar />
                <MobileBottomNav />
                <VisualSaveBar />
                <BackButton />
              </EditModeProvider>
            </InventoryProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
