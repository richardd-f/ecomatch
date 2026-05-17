"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { snap } from "@/lib/midtrans";

export async function createCheckoutSessionAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  // 1. Fetch Cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { error: "Cart is empty" };
  }

  // 2. Calculate Subtotal (gross amount)
  // Only TIER_1 items cost money. TIER_2 are free.
  const grossAmount = cart.items.reduce((total, item) => {
    if (item.product.tier === "TIER_2") return total;
    return total + item.product.endPrice * item.quantity;
  }, 0);

  // If gross amount is 0 (only free items), we don't need payment gateway
  if (grossAmount === 0) {
    return { error: "Total amount is 0, no payment needed." };
  }

  // 3. Generate Unique Order ID: ORDER-{userId}-{timestamp}-{CUID()}
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
  const orderId = `ORDER-${userId}-${Date.now()}-${randomStr}`;

  try {
    // 4. Create Order in Database
    await prisma.order.create({
      data: {
        id: orderId,
        userId: userId,
        grossAmount: grossAmount,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.product.endPrice,
          })),
        },
      },
    });

    // 5. Create Midtrans Transaction
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: session.user.name || "Customer",
        email: session.user.email || "",
      },
      // You can also map item_details here if you want granular data in Midtrans dashboard
    };

    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // 6. Update Order with Snap Token
    await prisma.order.update({
      where: { id: orderId },
      data: { snapToken },
    });

    return { success: true, snapToken };
  } catch (error: unknown) {
    console.error("Checkout Error:", error instanceof Error ? error.message : error);
    return { error: "Failed to initialize checkout session." };
  }
}
