import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch recent events from multiple sources
    const [orders, signups, favorites] = await Promise.all([
      prisma.$queryRaw`
        SELECT id, 'order' as type, "customerName" as user, "createdAt", "orderNumber" as detail 
        FROM "order" 
        ORDER BY "createdAt" DESC 
        LIMIT 5
      ` as Promise<any[]>,
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true }
      }),
      prisma.$queryRaw`
        SELECT f.id, 'favorite' as type, u.name as user, f."createdAt", p.name as detail 
        FROM favorite f
        JOIN "user" u ON f."userId" = u.id
        JOIN product p ON f."productId" = p.id
        ORDER BY f."createdAt" DESC 
        LIMIT 5
      ` as Promise<any[]>
    ]);

    // Format and combine
    const activities = [
      ...orders.map(o => ({
        id: `order-${o.id}`,
        type: 'order',
        user: o.user,
        detail: `Placed order ${o.detail}`,
        time: o.createdAt
      })),
      ...signups.map(s => ({
        id: `user-${s.id}`,
        type: 'signup',
        user: s.name || s.email,
        detail: 'Joined the platform',
        time: s.createdAt
      })),
      ...(favorites || []).map(f => ({
        id: `fav-${f.id}`,
        type: 'favorite',
        user: f.user,
        detail: `Loved "${f.detail}"`,
        time: f.createdAt
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
     .slice(0, 10);

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Activity API Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
