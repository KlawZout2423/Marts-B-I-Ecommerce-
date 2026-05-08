export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number | string;
  originalPrice?: number | string;
  description: string;
  category: string;
  image: string;
  features: string[];
  specs: { [key: string]: string };
  rating?: number;
  reviewCount?: number;
  badge?: "Best Seller" | "New" | "Sale";
  stock?: number;
  placements?: string[];
  createdAt: string;
  updatedAt: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Cute Soft Teddybear",
    slug: "cute-soft-teddybear",
    sku: "TEDDY-001",
    price: 285,
    originalPrice: 345,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1559440666-374c0df2f38d?auto=format&fit=crop&q=80&w=600",
    description: "A premium, soft teddybear perfect for all ages.",
    features: ["Eco-friendly materials", "Extra soft", "Hand-stitched"],
    specs: { "Material": "Plush", "Size": "Large" },
    rating: 4.0,
    reviewCount: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "MacBook Air Pro",
    slug: "macbook-air-pro",
    sku: "MAC-001",
    price: 650,
    originalPrice: 900,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600",
    description: "Powerful and portable computing for the modern professional.",
    features: ["M2 Chip", "Liquid Retina Display", "18-hour battery"],
    specs: { "RAM": "16GB", "Storage": "512GB" },
    rating: 5.0,
    reviewCount: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Gaming Console",
    slug: "gaming-console",
    sku: "GAME-001",
    price: 25,
    originalPrice: 31,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1592840331052-16e15c2c6f95?auto=format&fit=crop&q=80&w=600",
    description: "Immersive gaming experience in the palm of your hand.",
    features: ["4K Output", "Wireless Controller", "Haptic Feedback"],
    specs: { "Storage": "1TB", "Resolution": "4K" },
    rating: 4.5,
    reviewCount: 88,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Premium Headphones",
    slug: "premium-headphones",
    sku: "HEAD-001",
    price: 199,
    originalPrice: 249,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    description: "Experience sound like never before with our studio-grade headphones.",
    features: ["Noise Cancellation", "Hi-Res Audio", "Leather cushions"],
    specs: { "Driver": "40mm", "Battery": "30h" },
    rating: 4.8,
    reviewCount: 250,
    badge: "Best Seller",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
