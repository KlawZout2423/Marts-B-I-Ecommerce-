import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Seeding products...");
    await prisma.product.deleteMany();

    const products = [
      {
        name: "Modern Leather Sofa",
        price: "1299.99",
        stock: 5,
        category: "Living Room",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        placements: ["homepage", "bestseller"],
      },
      {
        name: "Minimalist Coffee Table",
        price: "249.50",
        stock: 12,
        category: "Living Room",
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80",
        placements: ["homepage"],
      },
      {
        name: "Ergonomic Office Chair",
        price: "450.00",
        stock: 8,
        category: "Office",
        image: "https://images.unsplash.com/photo-1505797149-43b007664a3d?w=800&q=80",
        placements: ["homepage", "new_arrivals"],
      },
      {
        name: "Walnut Dining Table",
        price: "899.00",
        stock: 3,
        category: "Dining",
        image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80",
        placements: ["featured"],
      },
      {
        name: "Velvet Accent Chair",
        price: "320.00",
        stock: 15,
        category: "Bedroom",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        placements: ["hot_sale"],
      },
      {
        name: "Industrial Floor Lamp",
        price: "125.00",
        stock: 20,
        category: "Lighting",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed657f9971?w=800&q=80",
        placements: ["homepage", "new_arrivals"],
      },
    ];

    for (const p of products) {
      await prisma.product.create({
        data: {
          name: p.name,
          slug: p.name.toLowerCase().replace(/ /g, "-"),
          sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
          price: p.price,
          stock: p.stock,
          category: p.category,
          image: p.image,
          placements: JSON.stringify(p.placements),
          status: "active",
        },
      });
    }

    return NextResponse.json({ success: true, message: "Seeded successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
