import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });
  
  if (!session?.data?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.data.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (!session?.data?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { label, name, phone, line1, line2, city, state, country, isDefault } = body;

  // If this is the first address, or if it's explicitly set as default
  const existingAddressesCount = await prisma.address.count({
    where: { userId: session.data.user.id }
  });

  const finalIsDefault = existingAddressesCount === 0 || isDefault;

  // If this is the default address, unset other default addresses
  if (finalIsDefault) {
    await prisma.address.updateMany({
      where: { userId: session.data.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: session.data.user.id,
      label: label || "Home",
      name,
      phone,
      line1,
      line2,
      city,
      state,
      country,
      isDefault: !!finalIsDefault,
    },
  });

  return NextResponse.json(address);
}
