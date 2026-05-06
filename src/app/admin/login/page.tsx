"use client";

import { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import styles from "../AdminLayout.module.css"; // Reuse some layouts
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid admin credentials");
      } else {
        toast.success("Welcome back, Admin!");
        // Small delay to allow the session cookie to be fully written
        // before the hard navigation triggers an auth check in admin layout
        setTimeout(() => {
          window.location.href = "/admin";
        }, 500);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc', padding: '20px'
    }}>
      <div style={{ 
        width: '100%', maxWidth: '400px', background: 'white', padding: '40px',
        borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '48px', height: '48px', background: '#0ea5e9', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
          }}>
            <ShieldCheck color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Admin Portal</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>Welcome back to MARTS Beta.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email" style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input 
                id="email"
                name="email"
                type="email" 
                required
                autoComplete="email"
                style={{ 
                  width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px',
                  border: '1px solid #e2e8f0', outline: 'none', transition: '0.2s'
                }}
                placeholder="admin@marts.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="password" style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input 
                id="password"
                name="password"
                type="password" 
                required
                autoComplete="current-password"
                style={{ 
                  width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px',
                  border: '1px solid #e2e8f0', outline: 'none', transition: '0.2s'
                }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '12px', borderRadius: '10px', background: '#0f172a',
              color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '8px', transition: '0.2s', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Authenticating..." : "Sign In to Admin"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#0ea5e9', textDecoration: 'none', fontWeight: 500 }}>
            ← Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
