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
};

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});

  const { data: session } = authClient.useSession();

  useEffect(() => {
    // Only allow editing if user is logged in and has admin role
    if (session?.user && (session.user as any).role === "admin") {
      setCanEdit(true); 
      
      // Check if we should start in edit mode (e.g. via URL param)
      const params = new URLSearchParams(window.location.search);
      if (params.get('edit') === 'true') {
        setIsEditMode(true);
      }
    } else {
      setCanEdit(false);
      setIsEditMode(false);
    }
  }, [session]);

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
      setActivePage
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
