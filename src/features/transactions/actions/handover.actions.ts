"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function processHandoverAction(transactionId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "MERCHANT") {
      return { success: false, error: "Unauthorized" };
    }

    // Verify transaction exists and is valid for handover
    const order = await prisma.order.findUnique({
      where: { id: transactionId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!order) {
      return { success: false, error: "Transaction not found." };
    }

    if (order.claimStatus === "PICKED_UP") {
      return { success: false, error: "This transaction has already been picked up." };
    }

    // Verify that this merchant owns the products in the order
    const isOwner = order.items.some(item => item.product.merchantId === session.user.id);
    if (!isOwner) {
      return { success: false, error: "This transaction belongs to a different merchant." };
    }

    // Process handover
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: transactionId },
        data: { claimStatus: "PICKED_UP" }
      });

      // Update product statuses if all claims/quantities are handled
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { status: "CLAIMED" }
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Handover Error:", error);
    return { success: false, error: "An unexpected error occurred during handover." };
  }
}
