import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch only public store settings
    const settings = await prisma.$queryRaw`
      SELECT "storeName", "contactEmail", "contactPhone", "whatsappNumber", "currency" 
      FROM store_settings 
      WHERE id = 'default'
    ` as any[];

    if (!settings || settings.length === 0) {
      return NextResponse.json({
        storeName: "MARTS",
        contactEmail: "support@marts.com",
        contactPhone: "",
        currency: "GHS"
      });
    }

    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error("Public Settings GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
