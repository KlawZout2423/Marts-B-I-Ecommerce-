import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const order = await prisma.$queryRaw`
      SELECT o.*, 
        (SELECT json_agg(item) FROM (SELECT * FROM order_item WHERE "orderId" = o.id) item) as items,
        o."customerName" as "customerName",
        o."customerEmail" as "customerEmail",
        o."customerPhone" as "customerPhone",
        o."shippingAddress" as "shippingAddress"
      FROM "order" o
      WHERE o.id = ${id}` as any;
    if (!order || order.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order[0]);
  } catch (error) {
    console.error("GET order error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
