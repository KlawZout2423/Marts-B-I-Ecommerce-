import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = parseInt(searchParams.get("range") || "7");

    const rangeDate = new Date();
    rangeDate.setDate(rangeDate.getDate() - range);

    // 1. Fetch Basic Counts (Bulletproof Raw SQL)
    const [
      productsCount, 
      usersCount, 
      ordersRaw, 
      favoritesRaw, 
      revenueRaw,
      messagesRaw,
      subscribersRaw
    ] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.$queryRaw`SELECT COUNT(*) as count FROM "order"` as Promise<any>,
      prisma.$queryRaw`SELECT COUNT(*) as count FROM favorite` as Promise<any>,
      prisma.$queryRaw`SELECT SUM("totalAmount") as total FROM "order"` as Promise<any>,
      prisma.$queryRaw`SELECT COUNT(*) as count FROM contact_message` as Promise<any>,
      prisma.$queryRaw`SELECT COUNT(*) as count FROM subscriber` as Promise<any>
    ]);

    const totalOrders = Number(ordersRaw[0]?.count || 0);
    const totalFavorites = Number(favoritesRaw[0]?.count || 0);
    const totalRevenue = Number(revenueRaw[0]?.total || 0);
    const totalMessages = Number(messagesRaw[0]?.count || 0);
    const totalSubscribers = Number(subscribersRaw[0]?.count || 0);

    // 2. Fetch Daily Data for the requested range (Orders)
    const dailyOrders = [];
    const labels = [];
    
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const countRaw = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM "order" 
        WHERE "createdAt" >= ${d} AND "createdAt" < ${nextD}
      ` as any[];
      
      dailyOrders.push(Number(countRaw[0]?.count || 0));
      labels.push(d.toLocaleDateString('en-US', { 
        weekday: range <= 7 ? 'short' : undefined,
        day: 'numeric',
        month: range > 7 ? 'short' : undefined
      }));
    }

    // 3. Fetch Top 3 Loved Products
    const topFavoritesRaw = await prisma.$queryRaw`
      SELECT "productId", COUNT(*) as fav_count 
      FROM favorite 
      GROUP BY "productId" 
      ORDER BY fav_count DESC 
      LIMIT 3
    ` as any[];

    const topLoved = await Promise.all(
      (topFavoritesRaw || []).map(async (fav: any) => {
        const product = await prisma.product.findUnique({
          where: { id: fav.productId },
          select: { id: true, name: true, image: true }
        });
        if (!product) return null;
        return {
          ...product,
          count: Number(fav.fav_count)
        };
      })
    );
    
    return NextResponse.json({
      totalProducts: productsCount,
      totalFavorites,
      totalUsers: usersCount,
      totalOrders,
      totalRevenue,
      totalMessages,
      totalSubscribers,
      dailySignups: dailyOrders, // We repurpose this for the chart
      chartLabels: labels,
      topLoved: topLoved.filter(p => p !== null),
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error("CRITICAL: Failed to fetch admin stats:", error);
    return NextResponse.json({ 
      error: "Some stats failed to load",
    }, { status: 500 });
  }
}
