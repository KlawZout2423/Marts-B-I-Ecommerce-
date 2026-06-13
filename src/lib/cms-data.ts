// Shared Product Data and Types for the Admin Panel
export type ProductPlacement = "homepage" | "new_arrivals" | "hot_sale" | "featured" | "bestseller";

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  status: string;
  image: string;
  category: string;
  placements: ProductPlacement[];
  salePrice?: string;
};

export const INITIAL_PRODUCTS: Product[] = [
  { 
    id: "PRD-001", 
    name: "Sony WH-1000XM5", 
    sku: "SNY-WH-05", 
    price: "398.00", 
    stock: 45, 
    status: "In Stock", 
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    category: "Electronics",
    placements: ["homepage", "featured"]
  },
  { 
    id: "PRD-002", 
    name: "Bose QuietComfort 45", 
    sku: "BSE-QC-45", 
    price: "329.00", 
    stock: 12, 
    status: "Low Stock", 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Electronics",
    placements: ["new_arrivals"]
  },
  { 
    id: "PRD-003", 
    name: "Sennheiser Momentum 4", 
    sku: "SNN-MM-04", 
    price: "349.00", 
    stock: 0, 
    status: "Out of Stock", 
    image: "https://images.unsplash.com/photo-1583394838336-397577f14f40?w=800&q=80",
    category: "Electronics",
    placements: ["hot_sale"]
  },
];
