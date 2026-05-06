"use client";

import { useEditMode } from "@/context/EditModeContext";
import { Save, Edit3, Eye, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

export default function VisualSaveBar() {
  const { isEditMode, toggleEditMode, pageBlocks, canEdit, activePage } = useEditMode();
  const [isSaving, setIsSaving] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (!canEdit) return null;


  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          route: pathname.startsWith('/admin') ? (activePage || '/') : pathname, 
          blocks: JSON.stringify(pageBlocks.map(({ icon, ...rest }) => rest)) 
        }),
      });
      
      if (res.ok) {
        toast.success("All changes published successfully!");
        // Force a reload after a short delay to pull fresh data from DB
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Failed to publish changes.");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Floating Toggle (Only show when NOT in edit mode) */}
      {!isEditMode && (
        <button 
          onClick={toggleEditMode}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            zIndex: 6000,
            background: '#0f172a',
            color: 'white',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          title="Enter Edit Mode"
        >
          <Edit3 size={24} />
        </button>
      )}

      {isEditMode && (
        <div className="save-bar">
          {/* Quick Page Switcher */}
          <div className="page-switcher">
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Editing:</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map(p => (
                <a
                  key={p.path}
                  href={p.path + "?edit=true"}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: (pathname === p.path || (pathname === '/admin/content' && activePage === p.path)) ? 'white' : 'rgba(255,255,255,0.6)',
                    background: (pathname === p.path || (pathname === '/admin/content' && activePage === p.path)) ? 'rgba(255,255,255,0.1)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {p.name}
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>Edit Mode</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              style={{
                background: '#22c55e',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '100px',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isSaving ? <div className="spinner" /> : <Save size={16} />}
              <span className="publish-btn-text">
                {isSaving ? "Publishing..." : "Publish Changes"}
              </span>
            </button>

            <button 
              onClick={() => {
                toggleEditMode();
                router.push("/admin/content");
              }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '100px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Exit
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .save-bar {
          position: fixed;
          bottom: 110px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99999;
          background: #0f172a;
          padding: 8px 8px 8px 24px;
          borderRadius: 100px;
          display: flex;
          align-items: center;
          gap: 24px;
          boxShadow: 0 20px 40px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          width: auto;
          white-space: nowrap;
        }

        .page-switcher {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-right: 24px;
          border-right: 1px solid rgba(255,255,255,0.1);
        }

        @keyframes slideUp { from { transform: translate(-50%, 100px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
        .spinner { width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .save-bar {
            bottom: 100px;
            padding: 8px;
            gap: 12px;
            width: calc(100% - 40px);
            max-width: 350px;
            justify-content: space-between;
          }
          .page-switcher {
            display: none;
          }
          .publish-btn-text {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
