import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Delete all related records first to avoid FK violations
    await prisma.favorite.deleteMany({ where: { productId: id } });
    await prisma.inventoryLog.deleteMany({ where: { productId: id } });
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...body,
        placements: body.placements ? JSON.stringify(body.placements) : undefined,
        gallery: body.gallery ? JSON.stringify(body.gallery) : undefined,
        attributes: body.attributes ? JSON.stringify(body.attributes) : undefined,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
