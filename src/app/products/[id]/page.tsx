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
    originalPrice: dbProduct.salePrice ? dbProduct.price : undefined,
    price: dbProduct.salePrice || dbProduct.price,
    badge: dbProduct.status === "active" ? undefined : dbProduct.status,
    reviewCount: 0, // Mocked for now
    rating: 4.5, // Mocked for now
    placements: JSON.parse(dbProduct.placements || "[]"),
  } as any;

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
