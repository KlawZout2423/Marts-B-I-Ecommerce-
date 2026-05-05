import React from 'react';
import Link from 'next/link';
import styles from './CheckoutGate.module.css';

interface CheckoutGateProps {
  onContinueAsGuest: () => void;
}

const CheckoutGate: React.FC<CheckoutGateProps> = ({ onContinueAsGuest }) => {
  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.subtitle}>Choose how you'd like to proceed with your order</p>
        
        <div className={styles.options}>
          <div className={styles.authSection}>
            <h2 className={styles.sectionTitle}>Returning Customer?</h2>
            <p className={styles.sectionDescription}>Sign in to access your saved addresses and order history.</p>
            <div className={styles.buttonGroup}>
              <Link href="/login" className={styles.primaryButton}>
                Sign In
              </Link>
              <Link href="/signup" className={styles.secondaryButton}>
                Create Account
              </Link>
            </div>
          </div>
          
          <div className={styles.divider}>
            <span className={styles.dividerText}>OR</span>
          </div>
          
          <div className={styles.guestSection}>
            <h2 className={styles.sectionTitle}>New Customer?</h2>
            <p className={styles.sectionDescription}>Proceed to checkout as a guest. You can create an account later.</p>
            <button 
              onClick={onContinueAsGuest}
              className={styles.guestButton}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutGate;
