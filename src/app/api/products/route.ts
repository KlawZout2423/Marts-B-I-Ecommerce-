import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Parse JSON strings back to arrays/objects
    const parsedProducts = products.map(p => ({
      ...p,
      placements: JSON.parse(p.placements || "[]"),
      gallery: JSON.parse(p.gallery || "[]"),
      attributes: JSON.parse(p.attributes || "{}")
    }));

    return NextResponse.json(parsedProducts);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, price, stock, image, placements, category } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substr(2, 5),
        sku: id || `SKU-${Date.now()}`,
        price: price.toString(),
        stock: parseInt(stock) || 0,
        status: "active",
        image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        category: category || "Uncategorized",
        placements: JSON.stringify(placements || []),
      }
    });

    return NextResponse.json({
      ...product,
      placements: JSON.parse(product.placements || "[]"),
      gallery: JSON.parse(product.gallery || "[]"),
      attributes: JSON.parse(product.attributes || "{}")
    });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
