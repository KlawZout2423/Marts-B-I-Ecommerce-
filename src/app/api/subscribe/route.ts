import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email: rawEmail } = await request.json();
    const email = rawEmail?.toLowerCase().trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Check if already subscribed using Raw SQL (case-insensitive)
    const existing = await prisma.$queryRaw`
      SELECT id FROM subscriber WHERE LOWER(email) = ${email}
    ` as any[];

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: "Already subscribed!" });
    }

    // Insert using Raw SQL
    const id = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO subscriber (id, email, "createdAt") 
      VALUES (${id}, ${email}, NOW())
    `;

    return NextResponse.json({ message: "Successfully subscribed!" });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
