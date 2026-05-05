"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import styles from "../login/AuthPage.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        {/* 🖼️ Visual Section */}
        <div className={styles.imageSection}>
          <img 
            src="https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=1600" 
            alt="Security" 
            className={styles.bgImage} 
          />
          <div className={styles.imageOverlay}>
            <h1>Account Security</h1>
            <p>Don't worry, it happens to the best of us. Let's get you back into your account securely.</p>
          </div>
        </div>

        {/* 📝 Form Section */}
        <div className={styles.formSection}>
          <Link href="/login" className={styles.backHome}>
            <ArrowLeft size={16} /> Back to Login
          </Link>

          <div className={styles.formContainer}>
            <header className={styles.header}>
              <h2>Forgot Password?</h2>
              <p>Enter your email to receive a password reset link</p>
            </header>

            {!success ? (
              <form className={styles.form} onSubmit={handleSubmit}>
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

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? "Sending Link..." : "Send Reset Link"}
                </button>
              </form>
            ) : (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>✓</div>
                <h3>Check your email</h3>
                <p>We've sent a password reset link to <strong>{email}</strong></p>
                <Link href="/login" className={styles.submitBtn} style={{ textAlign: 'center', textDecoration: 'none' }}>
                  Back to Login
                </Link>
              </div>
            )}

            <footer className={styles.footer}>
              Remembered your password? <Link href="/login">Sign In</Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
