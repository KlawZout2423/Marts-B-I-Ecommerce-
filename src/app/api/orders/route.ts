import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.$queryRaw`
      SELECT o.*, 
        (SELECT json_agg(item) FROM (SELECT * FROM order_item WHERE "orderId" = o.id) item) as items
      FROM "order" o
      WHERE o."customerEmail" = ${session.user.email}
      ORDER BY o."createdAt" DESC` as any[];
    return NextResponse.json(orders || []);
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      city, 
      zipCode, 
      latitude,
      longitude,
      items 
    } = data;

    // SECURITY: Recalculate totalPrice on the server to prevent price manipulation
    let calculatedTotal = 0;
    for (const item of items) {
      calculatedTotal += Number(item.price) * item.quantity;
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // Use the server-calculated total
    const finalPrice = calculatedTotal;

    // Generate a unique order number (e.g., MRT-12345)
    const orderNumber = `MRT-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Order and Items using Raw SQL for maximum reliability
    const orderId = crypto.randomUUID();
    const fullName = `${firstName} ${lastName}`;
    const gpsString = latitude && longitude ? ` (GPS: ${latitude}, ${longitude})` : "";
    const shippingAddress = `${address}, ${city}, ${zipCode}${gpsString}`;

    await prisma.$executeRaw`
      INSERT INTO "order" (
        id, "orderNumber", "customerName", "customerEmail", "customerPhone", 
        "shippingAddress", "totalAmount", status, "createdAt"
      ) VALUES (
        ${orderId}, 
        ${orderNumber}, 
        ${fullName}, 
        ${email}, 
        ${phone || ''}, 
        ${shippingAddress}, 
        ${finalPrice}, 
        'pending', 
        NOW()
      )
    `;

    // Insert each order item
    for (const item of items) {
      const itemId = crypto.randomUUID();
      await prisma.$executeRaw`
        INSERT INTO "order_item" (
          id, "orderId", "productId", name, price, quantity, image
        ) VALUES (
          ${itemId}, 
          ${orderId}, 
          ${String(item.id)}, 
          ${item.name}, 
          ${item.price}, 
          ${item.quantity}, 
          ${item.image || ''}
        )
      `;
    }

    return NextResponse.json({ 
      success: true, 
      orderNumber, 
      orderId 
    });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ 
      error: "Failed to create order", 
      details: error.message 
    }, { status: 500 });
  }
}
