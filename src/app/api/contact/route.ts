import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Insert using Raw SQL to bypass Prisma client staleness
    const id = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO contact_message (id, name, email, message, status, "createdAt") 
      VALUES (${id}, ${name}, ${email}, ${message}, 'unread', NOW())
    `;

    return NextResponse.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
