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
    // Also ignore items with 0 quantity
    if (item.quantity === 0) return total;
    if (item.product.tier === "TIER_2") return total;
    return total + item.product.endPrice * item.quantity;
  }, 0);

  // Filter out 0 quantity items for the order
  const validItems = cart.items.filter(item => item.quantity > 0);
  if (validItems.length === 0) {
    return { error: "No valid items in cart to checkout." };
  }

  // 3. Generate Unique Order ID
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
  const orderId = `ORDER-${userId}-${Date.now()}-${randomStr}`;

  try {
    // If gross amount is 0 (only free items), we don't need payment gateway
    if (grossAmount === 0) {
      // Immediately create the order as PAID
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            id: orderId,
            userId: userId,
            grossAmount: 0,
            status: "PAID",
            items: {
              create: validItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: item.product.endPrice,
              })),
            },
          },
        });

        // Reduce product stock
        for (const item of validItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: { decrement: item.quantity } },
          });
        }

        // Clear cart
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      });

      return { success: true, isFree: true };
    }

    // 4. Create Midtrans Transaction (without creating order in DB yet!)
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: session.user.name || "Customer",
        email: session.user.email || "",
      },
    };

    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    return { success: true, snapToken, orderId };
  } catch (error: any) {
    console.error("Checkout Error:", error.message || error);
    return { error: "Failed to initialize checkout session." };
  }
}

export async function finalizeCheckoutAction(orderId: string, midtransTransactionId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  const userId = session.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) return { error: "Cart is empty" };

  const validItems = cart.items.filter(item => item.quantity > 0);
  if (validItems.length === 0) return { error: "No valid items." };

  const grossAmount = validItems.reduce((total, item) => {
    if (item.product.tier === "TIER_2") return total;
    return total + item.product.endPrice * item.quantity;
  }, 0);

  try {
    await prisma.$transaction(async (tx) => {
      // Create order
      await tx.order.create({
        data: {
          id: orderId,
          userId: userId,
          grossAmount: grossAmount,
          status: "PAID",
          midtransTransactionId,
          paymentType: "qris", // assumed or fetched from Midtrans
          snapToken: null,
          items: {
            create: validItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.endPrice,
            })),
          },
        },
      });

      // Reduce product stock
      for (const item of validItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    });

    return { success: true };
  } catch (err: any) {
    console.error("Finalize error:", err);
    return { error: "Failed to finalize order." };
  }
}
