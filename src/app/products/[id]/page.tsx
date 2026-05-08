import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { Product } from "@/data/products";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const dbProduct = await prisma.product.findUnique({ 
    where: { id } 
  });

  if (!dbProduct) notFound();

  // Map DB product to the Product type expected by the component
  const product: Product = {
    ...dbProduct,
    originalPrice: dbProduct.salePrice ? Number(dbProduct.price) : undefined,
    price: Number(dbProduct.salePrice || dbProduct.price),
    description: dbProduct.description || "Premium product from MARTS collection.",
    features: JSON.parse(dbProduct.features || "[]"),
    specs: JSON.parse(dbProduct.specs || "{}"),
    badge: (dbProduct.status === "active" ? undefined : dbProduct.status) as any,
    reviewCount: 0, 
    rating: 4.5,
    placements: JSON.parse(dbProduct.placements || "[]"),
    image: dbProduct.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    createdAt: dbProduct.createdAt.toISOString(),
    updatedAt: dbProduct.updatedAt.toISOString(),
  };

  return (
    <>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main>
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}
