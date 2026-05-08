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

    // Using Raw SQL to bypass Prisma client staleness
    const settings = await prisma.$queryRaw`
      SELECT * FROM store_settings WHERE id = 'default'
    ` as any[];

    if (!settings || settings.length === 0) {
      // Return default if not exists yet
      return NextResponse.json({
        storeName: "MARTS | Business & Imports",
        contactEmail: "support@marts.com",
        currency: "USD",
        timezone: "UTC",
        orderEmails: true,
        lowStockAlerts: true
      });
    }

    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
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

    const data = await request.json();
    
    // Upsert using Raw SQL to ensure it saves instantly
    await prisma.$executeRaw`
      INSERT INTO store_settings (
        id, "storeName", "contactEmail", "contactPhone", "whatsappNumber",
        currency, timezone, "orderEmails", "lowStockAlerts", "updatedAt"
      ) VALUES (
        'default', 
        ${data.storeName}, 
        ${data.contactEmail}, 
        ${data.contactPhone || ''}, 
        ${data.whatsappNumber || ''}, 
        ${data.currency}, 
        ${data.timezone}, 
        ${data.orderEmails}, 
        ${data.lowStockAlerts}, 
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        "storeName" = EXCLUDED."storeName",
        "contactEmail" = EXCLUDED."contactEmail",
        "contactPhone" = EXCLUDED."contactPhone",
        "whatsappNumber" = EXCLUDED."whatsappNumber",
        currency = EXCLUDED.currency,
        timezone = EXCLUDED.timezone,
        "orderEmails" = EXCLUDED."orderEmails",
        "lowStockAlerts" = EXCLUDED."lowStockAlerts",
        "updatedAt" = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Settings PATCH Error:", error);
    return NextResponse.json({ error: "Failed to save settings", details: error.message }, { status: 500 });
  }
}
