"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export type Block = {
  id: string;
  type: string;
  title: string;
  settings?: any;
  content?: any;
  icon?: React.ReactNode;
};



type EditModeContextType = {
  isEditMode: boolean;
  toggleEditMode: () => void;
  canEdit: boolean;
  pendingChanges: Record<string, any>;
  setPendingChange: (id: string, value: any) => void;
  clearPendingChanges: () => void;
  pageBlocks: Block[];
  allPageBlocks: Record<string, Block[]>;
  setPageBlocks: (blocks: Block[]) => void;
  setAllPageBlocks: (allBlocks: Record<string, Block[]>) => void;
  moveBlock: (index: number, direction: "up" | "down") => void;
  deleteBlock: (id: string) => void;
  addBlock: (type: string, title: string) => void;
  updateBlockContent: (id: string, content: any) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  globalBanner: { text: string };
  setGlobalBanner: (banner: { text: string }) => void;
};

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const canEdit = !!(session?.user && (session.user as any).role === "admin");
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});

  const [isEditMode, setIsEditMode] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get('edit') === 'true';
    }
    return false;
  });

  // Automatically turn off edit mode if user loses permission
  useEffect(() => {
    if (!canEdit && isEditMode) {
      setIsEditMode(false);
    }
  }, [canEdit, isEditMode]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const setPendingChange = (id: string, value: any) => {
    setPendingChanges(prev => ({ ...prev, [id]: value }));
  };

  const clearPendingChanges = () => {
    setPendingChanges({});
  };

  const [allPageBlocks, setAllPageBlocks] = useState<Record<string, Block[]>>({
    "/": [],
    "/shop": [],
    "/about": [],
    "/contact": []
  });
  const [activePage, setActivePage] = useState("/");

  const [globalBanner, setGlobalBanner] = useState<{ text: string }>({
    text: "Free Shipping on Orders Over $50"
  });

  useEffect(() => {
    const fetchGlobalBanner = async () => {
      try {
        const res = await fetch("/api/content?route=global_banner");
        const data = await res.json();
        if (data && data.blocks && data.blocks.length > 0) {
          const bannerBlock = data.blocks[0];
          if (bannerBlock && bannerBlock.content && bannerBlock.content.text) {
            setGlobalBanner({ text: bannerBlock.content.text });
          }
        }
      } catch (err) {
        console.error("Failed to fetch global banner content:", err);
      }
    };
    fetchGlobalBanner();
  }, []);

  const pageBlocks = allPageBlocks[activePage] || [];

  const setPageBlocks = (blocks: Block[]) => {
    setAllPageBlocks(prev => {
      // Basic check to see if we actually need to update
      const currentBlocks = prev[activePage] || [];
      if (JSON.stringify(currentBlocks) === JSON.stringify(blocks)) {
        return prev;
      }
      return { ...prev, [activePage]: blocks };
    });
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...pageBlocks];
    if (direction === "up" && index > 0) {
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index - 1];
      newBlocks[index - 1] = temp;
      setPageBlocks(newBlocks);
    } else if (direction === "down" && index < newBlocks.length - 1) {
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index + 1];
      newBlocks[index + 1] = temp;
      setPageBlocks(newBlocks);
    }
  };

  const deleteBlock = (id: string) => {
    const newBlocks = pageBlocks.filter((b) => b.id !== id);
    setPageBlocks(newBlocks);
  };

  const addBlock = (type: string, title: string) => {
    const newBlocks = [...pageBlocks, { id: `${type}-${Date.now()}`, type, title }];
    setPageBlocks(newBlocks);
  };

  const updateBlockContent = (id: string, content: any) => {
    setPageBlocks(pageBlocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...content } } : b));
  };

  return (
    <EditModeContext.Provider value={{ 
      isEditMode, 
      toggleEditMode, 
      canEdit, 
      pendingChanges, 
      setPendingChange,
      clearPendingChanges,
      pageBlocks,
      allPageBlocks,
      setPageBlocks,
      setAllPageBlocks,
      moveBlock,
      deleteBlock,
      addBlock,
      updateBlockContent,
      activePage,
      setActivePage,
      globalBanner,
      setGlobalBanner
    }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return context;
}
