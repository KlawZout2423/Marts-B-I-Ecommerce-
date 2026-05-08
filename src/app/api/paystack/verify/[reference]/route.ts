import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { reference: string } }
) {
  const { reference } = params;

  if (!reference) {
    return NextResponse.json({ error: "Reference is required" }, { status: 400 });
  }

  try {
    // 1. Call Paystack API to verify the transaction
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    
    if (!paystackSecret) {
      console.error("PAYSTACK_SECRET_KEY is missing in .env");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.status || data.data.status !== "success") {
      return NextResponse.json({ 
        error: "Payment verification failed", 
        details: data.message 
      }, { status: 400 });
    }

    // 2. Payment is valid! Update the specific order in our database.
    // We encoded the orderNumber into the reference as: MRT-123456_timestamp
    const [orderNumber] = reference.split("_");
    const customerEmail = data.data.customer.email;

    if (!orderNumber) {
      return NextResponse.json({ error: "Invalid reference format" }, { status: 400 });
    }

    // Update the specific 'pending' order that matches this orderNumber
    const orders = await prisma.$queryRaw`
      UPDATE "order"
      SET status = 'paid'
      WHERE "customerEmail" = ${customerEmail} 
      AND "orderNumber" = ${orderNumber}
      AND status = 'pending'
      RETURNING *
    ` as any[];

    if (orders.length === 0) {
      console.warn(`Payment verified for ${customerEmail} but no pending order found.`);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Payment verified and order updated",
      order: orders[0]
    });

  } catch (error: any) {
    console.error("Paystack Verification Error:", error);
    return NextResponse.json({ 
      error: "Failed to verify payment", 
      details: error.message 
    }, { status: 500 });
  }
}
