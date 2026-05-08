"use client";

import { useEditMode } from "@/context/EditModeContext";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface EditableSectionProps {
  id: string;
  index: number;
  totalBlocks: number;
  children: React.ReactNode;
}

export default function EditableSection({ id, index, totalBlocks, children }: EditableSectionProps) {
  const { isEditMode, moveBlock, deleteBlock } = useEditMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !isEditMode) return <>{children}</>;

  return (
    <div style={{
      position: 'relative',
      border: '2px dashed #38bdf8',
      margin: '16px 0',
      borderRadius: '12px',
      padding: '8px',
      transition: 'all 0.2s',
    }}>
      <div style={{
        position: 'absolute',
        top: '-16px',
        right: '16px',
        background: '#0f172a',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        gap: '4px',
        zIndex: 50,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <button 
          onClick={() => moveBlock(index, 'up')}
          disabled={index === 0}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: index === 0 ? 'not-allowed' : 'pointer',
            opacity: index === 0 ? 0.3 : 1,
            padding: '4px',
            display: 'flex'
          }}
          title="Move Up"
        >
          <ArrowUp size={16} />
        </button>
        <button 
          onClick={() => moveBlock(index, 'down')}
          disabled={index === totalBlocks - 1}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: index === totalBlocks - 1 ? 'not-allowed' : 'pointer',
            opacity: index === totalBlocks - 1 ? 0.3 : 1,
            padding: '4px',
            display: 'flex'
          }}
          title="Move Down"
        >
          <ArrowDown size={16} />
        </button>
        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
        <button 
          onClick={() => {
            if (confirm("Are you sure you want to remove this section?")) {
              deleteBlock(id);
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex'
          }}
          title="Delete Section"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      {children}
    </div>
  );
}
