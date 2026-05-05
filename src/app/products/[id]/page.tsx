import { products } from "@/data/products";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <Suspense fallback={null}>
      <Navbar />
      <main>
        <ProductDetail product={product} />
      </main>
      <Footer />
    </Suspense>
  );
}
