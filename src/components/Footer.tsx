"use client";

import styles from "./Footer.module.css";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>

          {/* Brand Identity */}
          <div className={styles.brand}>
            <img src="/logo.png" alt="MARTS Business & Imports" className={styles.footerLogo} />
            <p>Your premier partner for global business and imports. Providing premium gear and digital solutions to professionals around the globe.</p>
            <div className={styles.socials}>
              <button className={styles.socialBtn} aria-label="Facebook"><FacebookIcon /></button>
              <button className={styles.socialBtn} aria-label="Instagram"><InstagramIcon /></button>
              <button className={styles.socialBtn} aria-label="Twitter"><TwitterIcon /></button>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4>Customer Service</h4>
            <ul>
              <li>FAQs</li>
              <li>Shipping Info</li>
              <li>Returns</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms &amp; Conditions</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletter}>
            <h4>Newsletter</h4>
            <p>Subscribe for Updates &amp; Offers</p>
            <div className={styles.form}>
              <input type="email" placeholder="Email address..." className={styles.input} />
              <button className={styles.subscribeBtn}>Subscribe</button>
            </div>
          </div>

        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>© 2026 MARTS. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
