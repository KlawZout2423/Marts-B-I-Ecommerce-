import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch orders with their items using Raw SQL to ensure reliability
    const orders = await prisma.$queryRaw`
      SELECT o.*, 
             (SELECT json_agg(item) FROM (SELECT * FROM order_item WHERE "orderId" = o.id) item) as items
      FROM "order" o
      ORDER BY o."createdAt" DESC
    ` as any[];

    return NextResponse.json(orders || []);
  } catch (error) {
    console.error("Orders API Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ids, status } = await request.json();

    if (ids && Array.isArray(ids)) {
      // Bulk update
      await prisma.$executeRaw`
        UPDATE "order" SET status = ${status} WHERE id IN (${ids.join(',')})
      `;
    } else {
      // Single update
      await prisma.$executeRaw`
        UPDATE "order" SET status = ${status} WHERE id = ${id}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order Update Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ids } = await request.json();
    const targetIds = ids || [id];

    if (!targetIds || targetIds.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    // Use a transaction for safety
    await prisma.$transaction(async (tx) => {
      for (const tid of targetIds) {
        await tx.$executeRaw`DELETE FROM order_item WHERE "orderId" = ${tid}`;
        await tx.$executeRaw`DELETE FROM "order" WHERE id = ${tid}`;
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
