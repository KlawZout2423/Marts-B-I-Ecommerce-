import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function main() {
  console.log("Seeding admin user...");
  const adminEmail = "admin@marts.com";
  const adminPassword = "password123";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    // Import auth config dynamically to avoid issues with top-level imports
    const { auth } = require("../src/lib/auth");

    try {
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: "Eugene Admin",
        }
      });
      
      // Patch the role to admin
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: "admin" },
      });
      console.log("✅ Admin user created with role=admin.");
    } catch (e: any) {
      console.error("Failed to create admin:", e);
      throw e;
    }
  } else {
    // Ensure existing user has admin role
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "admin" },
    });
    console.log("✅ Admin user already exists — role updated to admin.");
  }

  console.log("Seeding products...");

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
    const slug = p.name.toLowerCase().replace(/ /g, "-");
    await prisma.product.upsert({
      where: { slug },
      update: {
        price: p.price,
        stock: p.stock,
        category: p.category,
        image: p.image,
        placements: JSON.stringify(p.placements),
        status: "active",
      },
      create: {
        name: p.name,
        slug,
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

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
