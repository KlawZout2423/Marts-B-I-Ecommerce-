"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Mail, Shield, User, Lock, Eye, EyeOff, Globe, Code } from "lucide-react";
import { toast } from "sonner";
import styles from "../login/AuthPage.module.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });

      if (authError) {
        setError(authError.message || "Registration failed");
        toast.error(authError.message || "Registration failed");
      } else {
        toast.success("Account created successfully! Welcome to MARTS.");
        router.push("/");
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
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1600" 
            alt="Modern Workspace" 
            className={styles.bgImage} 
          />
          <div className={styles.imageOverlay}>
            <h1>Join the MARTS Community</h1>
            <p>Create an account to save your favorite imports, get early access to drops, and enjoy a personalized shopping experience.</p>
          </div>
        </div>

        {/* 📝 Form Section */}
        <div className={styles.formSection}>
          <Link href="/" className={styles.backHome}>
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className={styles.formContainer}>
            <header className={styles.header}>
              <h2>Create Account</h2>
              <p>Join thousands of professionals worldwide</p>
            </header>

            <div className={styles.socialButtons}>
              <button className={styles.socialBtn}>
                <Globe size={18} /> Google
              </button>
              <button className={styles.socialBtn}>
                <Code size={18} /> GitHub
              </button>
            </div>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span>or sign up with</span>
              <div className={styles.dividerLine} />
            </div>

            <form className={styles.form} onSubmit={handleSignup}>
              {error && <div className={styles.errorBanner}>{error}</div>}
              
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="John Doe" 
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="name@example.com" 
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
                    placeholder="••••••••" 
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

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <footer className={styles.footer}>
              Already have an account? <Link href="/login">Sign In</Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
