'use client';

import dynamic from 'next/dynamic';

const CheckoutClient = dynamic(() => import('./CheckoutClient'), {
  ssr: false,
  loading: () => <div style={{ 
    padding: '10rem 0', 
    textAlign: 'center', 
    fontWeight: 600, 
    color: '#64748b' 
  }}>Loading Checkout...</div>
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
