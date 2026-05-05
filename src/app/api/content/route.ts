import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const route = searchParams.get("route");

  if (!route) {
    return NextResponse.json({ error: "Route is required" }, { status: 400 });
  }

  try {
    const content = await prisma.pageContent.findUnique({
      where: { route },
    });

    if (!content) {
      return NextResponse.json({ blocks: [] });
    }

    return NextResponse.json({
      blocks: JSON.parse(content.blocks),
      updatedAt: content.updatedAt,
    });
  } catch (err) {
    console.error("API Content GET Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { route, blocks } = await request.json();

    if (!route || !blocks) {
      return NextResponse.json({ error: "Route and blocks are required" }, { status: 400 });
    }

    const content = await prisma.pageContent.upsert({
      where: { route },
      update: { blocks, updatedAt: new Date() },
      create: { route, blocks },
    });

    return NextResponse.json({
      success: true,
      blocks: JSON.parse(content.blocks),
    });
  } catch (err) {
    console.error("API Content POST Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
