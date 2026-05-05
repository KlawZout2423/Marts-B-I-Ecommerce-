"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, INITIAL_PRODUCTS } from "@/lib/cms-data";

type InventoryContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Fetch from DB on mount
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProducts(data);
      });
  }, []);

  const addProduct = async (product: Product) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const saved = await res.json();
    setProducts([saved, ...products]);
  };

  const updateProduct = async (product: Product) => {
    // Implement PUT in API if needed, for now update local and log
    setProducts(products.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <InventoryContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
