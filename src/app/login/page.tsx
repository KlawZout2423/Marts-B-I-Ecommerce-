"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Mail, Lock, Shield, User, Eye, EyeOff, Globe, Code } from "lucide-react";
import { toast } from "sonner";
import styles from "./AuthPage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Login failed");
        toast.error(authError.message || "Login failed");
      } else {
        toast.success("Welcome back! You have successfully logged in.");
        
        // Check role to determine destination
        if (data?.user && (data.user as any).role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {/* 🖼️ Visual Section */}
        <div className={styles.imageSection}>
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1600"
            alt="Premium Tech"
            className={styles.bgImage}
          />
          <div className={styles.imageOverlay}>
            <h1>Premium Imports</h1>
            <p>Access your curated collection of global imports and track your premium orders in real-time.</p>
          </div>
        </div>

        {/* 📝 Form Section */}
        <div className={styles.formSection}>
          <Link href="/" className={styles.backHome} title="Back to Home">
            <ArrowLeft size={20} />
          </Link>

          <div className={styles.formContainer}>
            <header className={styles.header}>
              <h2>Welcome to MARTS</h2>
              <p>Your Premium E-commerce Dashboard</p>
            </header>

            <div className={styles.socialButtonsSingle}>
              <button className={styles.socialBtn}>
                <Globe size={18} /> Continue with Google
              </button>
            </div>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span>or sign in with</span>
              <div className={styles.dividerLine} />
            </div>

            <form className={styles.form} onSubmit={handleLogin}>
              {error && <div className={styles.errorBanner}>{error}</div>}

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.formFooter}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" />
                  Remember this Device
                </label>
                <Link href="/forgot-password" className={styles.forgotPassword}>
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <footer className={styles.footer}>
              New to MARTS? <Link href="/signup">Create an account</Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
