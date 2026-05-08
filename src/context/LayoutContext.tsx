"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type LayoutMode = "top" | "sidebar";

interface LayoutContextType {
  mode: LayoutMode;
  setMode: (mode: LayoutMode) => void;
  toggleMode: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<LayoutMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lumina-layout-mode") as LayoutMode;
      return saved || "top";
    }
    return "top";
  });

  const handleSetMode = (newMode: LayoutMode) => {
    setMode(newMode);
    localStorage.setItem("lumina-layout-mode", newMode);
  };

  const toggleMode = () => {
    const newMode = mode === "top" ? "sidebar" : "top";
    handleSetMode(newMode);
  };

  return (
    <LayoutContext.Provider value={{ mode, setMode: handleSetMode, toggleMode }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
