"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface StoreSettings {
  storeName: string;
  currency: string;
  currencySymbol: string;
  contactEmail: string;
  contactPhone: string;
}

interface StoreContextType {
  settings: StoreSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "MARTS",
    currency: "USD",
    currencySymbol: "$",
    contactEmail: "",
    contactPhone: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  const getSymbol = (currency: string) => {
    switch (currency) {
      case "GHS": return "GH₵";
      case "NGN": return "₦";
      case "EUR": return "€";
      case "GBP": return "£";
      case "KES": return "KSh";
      default: return "$";
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data && !data.error) {
        setSettings({
          storeName: data.storeName,
          currency: data.currency,
          currencySymbol: getSymbol(data.currency),
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || ""
        });
      }
    } catch (err) {
      console.error("Failed to fetch store settings", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <StoreContext.Provider value={{ settings, isLoading, refreshSettings: fetchSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};
