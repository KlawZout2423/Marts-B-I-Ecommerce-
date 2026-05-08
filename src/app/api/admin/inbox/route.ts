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

    // Fetch Messages & Subscribers using Raw SQL to bypass staleness
    const messages = await prisma.$queryRaw`
      SELECT * FROM contact_message ORDER BY "createdAt" DESC
    ` as any[];

    const subscribers = await prisma.$queryRaw`
      SELECT * FROM subscriber ORDER BY "createdAt" DESC
    ` as any[];

    return NextResponse.json({
      messages: messages || [],
      subscribers: subscribers || []
    });
  } catch (error) {
    console.error("Inbox API Error:", error);
    return NextResponse.json({ error: "Failed to fetch inbox data" }, { status: 500 });
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

    const { id, status } = await request.json();

    await prisma.$executeRaw`
      UPDATE contact_message SET status = ${status} WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inbox Update Error:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}
