import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ favorites: [] });
    }

    // Using raw SQL to bypass Prisma client staleness
    const favorites = await prisma.$queryRaw`
      SELECT "productId" FROM favorite WHERE "userId" = ${session.user.id}
    ` as any[];

    return NextResponse.json({ 
      favorites: (favorites || []).map(f => f.productId) 
    });
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // Check if it already exists using Raw SQL
    const existing = await prisma.$queryRaw`
      SELECT id FROM favorite WHERE "userId" = ${session.user.id} AND "productId" = ${productId}
    ` as any[];

    if (existing && existing.length > 0) {
      // Remove it using Raw SQL
      await prisma.$executeRaw`
        DELETE FROM favorite WHERE id = ${existing[0].id}
      `;
      return NextResponse.json({ action: "removed", productId });
    } else {
      // Add it using Raw SQL
      const id = crypto.randomUUID();
      await prisma.$executeRaw`
        INSERT INTO favorite (id, "userId", "productId", "createdAt") 
        VALUES (${id}, ${session.user.id}, ${productId}, NOW())
      `;
      return NextResponse.json({ action: "added", productId });
    }
  } catch (error: any) {
    console.error("FAVORITES SYNC ERROR:", error);
    return NextResponse.json({ 
      error: "Failed to toggle favorite",
      details: error.message 
    }, { status: 500 });
  }
}
