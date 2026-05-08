import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  // Verify ownership
  const address = await prisma.address.findUnique({
    where: { id }
  });

  if (!address || address.userId !== session.data.user.id) {
    return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
  }

  await prisma.address.delete({
    where: { id }
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();
  const { isDefault, ...rest } = body;

  // Verify ownership
  const address = await prisma.address.findUnique({
    where: { id }
  });

  if (!address || address.userId !== session.data.user.id) {
    return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
  }

  // If setting as default
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.data.user.id },
      data: { isDefault: false },
    });
  }

  const updatedAddress = await prisma.address.update({
    where: { id },
    data: {
      ...rest,
      isDefault: isDefault === undefined ? address.isDefault : !!isDefault
    },
  });

  return NextResponse.json(updatedAddress);
}
