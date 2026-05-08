"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Initial load & Merge Logic
  useEffect(() => {
    const loadFavorites = async () => {
      // Always get local ones first
      const localSaved = localStorage.getItem("marts_favorites");
      const localFavs: string[] = localSaved ? JSON.parse(localSaved) : [];

      if (session?.user) {
        try {
          const res = await fetch("/api/favorites");
          const data = await res.json();
          
          if (data.favorites) {
            // MERGE: Combine local and DB favorites, removing duplicates
            const dbFavs = data.favorites as string[];
            const merged = Array.from(new Set([...dbFavs, ...localFavs]));
            
            setFavorites(merged);

            // If we have local ones that aren't in the DB, sync them up
            const newToDb = localFavs.filter(id => !dbFavs.includes(id));
            if (newToDb.length > 0) {
              console.log(`Merging ${newToDb.length} local favorites to DB...`);
              for (const productId of newToDb) {
                await fetch("/api/favorites", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId })
                });
              }
              // Clear local once synced to DB to prevent loops
              localStorage.removeItem("marts_favorites");
            }
          }
        } catch (e) {
          console.error("Failed to sync favorites with DB", e);
          setFavorites(localFavs);
        }
      } else {
        setFavorites(localFavs);
      }
      setIsInitialized(true);
    };

    loadFavorites();
  }, [session]);

  // 2. Persist to local for guests
  useEffect(() => {
    if (isInitialized && !session) {
      localStorage.setItem("marts_favorites", JSON.stringify(favorites));
    }
  }, [favorites, session, isInitialized]);

  const toggleFavorite = async (productId: string) => {
    // Optimistic UI update
    const isAdding = !favorites.includes(productId);
    setFavorites(prev => 
      isAdding ? [...prev, productId] : prev.filter(id => id !== productId)
    );

    // If logged in, sync with DB
    if (session?.user) {
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId })
        });
        
        if (!res.ok) throw new Error("Sync failed");
        
        // Success feedback
        if (isAdding) {
          toast.success("Added to favorites", {
            description: "Saved to your account",
            duration: 2000
          });
        }
      } catch (e) {
        console.error("Failed to sync favorite to DB", e);
        // Fallback: keep it local
        toast.error("Cloud sync failed", {
          description: "Saved to your browser instead",
        });
      }
    } else {
      // Guest feedback
      if (isAdding) {
        toast.info("Added to favorites", {
          description: "Log in to save across devices",
          duration: 3000
        });
      }
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        toggleFavorite, 
        isFavorite, 
        totalFavorites: favorites.length 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
};
