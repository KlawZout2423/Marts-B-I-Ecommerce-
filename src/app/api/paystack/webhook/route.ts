import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret || !signature) {
      return NextResponse.json({ error: "Missing configuration" }, { status: 400 });
    }

    // 1. Verify the signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("Paystack Webhook signature mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // 2. Handle the event
    if (event.event === "charge.success") {
      const data = event.data;
      const customerEmail = data.customer.email;
      const reference = data.reference;
      
      // Extract orderNumber from the reference
      const [orderNumber] = reference.split("_");

      console.log(`Paystack Webhook: Payment success for ${customerEmail} (Ref: ${reference})`);

      if (orderNumber) {
        // Update the specific order status to 'paid'
        await prisma.$executeRaw`
          UPDATE "order"
          SET status = 'paid'
          WHERE "customerEmail" = ${customerEmail} 
          AND "orderNumber" = ${orderNumber}
          AND status = 'pending'
        `;
      }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error("Paystack Webhook Error:", error);
    return NextResponse.json({ 
      error: "Webhook processing failed", 
      details: error.message 
    }, { status: 500 });
  }
}
