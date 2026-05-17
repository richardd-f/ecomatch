"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function claimOrderAction(orderId: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== "MERCHANT") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true
      }
    });

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    if (order.status !== "PAID") {
      return { success: false, message: "Order must be PAID to be claimed" };
    }

    if (order.claimStatus !== "PENDING") {
      return { success: false, message: "Order has already been claimed or is not pending" };
    }

    // Update order claimStatus and update products' status conditionally
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { claimStatus: "PICKED_UP" },
      });

      for (const item of order.items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId }
        });
        if (prod) {
          // If no stock is left, mark as CLAIMED. Otherwise, keep it AVAILABLE.
          const nextStatus = prod.quantity === 0 ? "CLAIMED" : "AVAILABLE";
          await tx.product.update({
            where: { id: item.productId },
            data: { status: nextStatus },
          });
        }
      }
    });

    revalidatePath("/merchant");
    revalidatePath("/myItems");

    return { success: true, message: "Order claimed successfully!" };
  } catch (error) {
    console.error("Failed to claim order:", error);
    return { success: false, message: "An error occurred while claiming the order" };
  }
}
