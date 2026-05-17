import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const hash = crypto
      .createHash("sha512")
      .update(
        `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`
      )
      .digest("hex");

    if (hash !== payload.signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;
    const orderId = payload.order_id;
    const midtransTransactionId = payload.transaction_id;
    const paymentType = payload.payment_type;

    let newStatus: "PENDING" | "PAID" | "CANCELED" | "EXPIRED" = "PENDING";

    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        newStatus = "PENDING";
      } else if (fraudStatus === "accept") {
        newStatus = "PAID";
      }
    } else if (transactionStatus === "settlement") {
      newStatus = "PAID";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      newStatus = transactionStatus === "expire" ? "EXPIRED" : "CANCELED";
    } else if (transactionStatus === "pending") {
      newStatus = "PENDING";
    }

    // Fetch existing order to prevent reverting status
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (existingOrder) {
      // Do not revert to PENDING if already PAID
      if (existingOrder.status === "PAID" && newStatus === "PENDING") {
        newStatus = "PAID";
      }
      
      // Do not update anything if the item is already handed over
      if (existingOrder.claimStatus === "PICKED_UP") {
        return NextResponse.json({ success: true, message: "OK (Already picked up, ignoring webhook)" });
      }
    }

    // Update the order in the database
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        midtransTransactionId,
        paymentType,
        transactionStatus,
      },
    });

    return NextResponse.json({ success: true, message: "OK" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
