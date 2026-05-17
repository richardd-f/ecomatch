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

    if (order.claimStatus !== "PICKED_UP") {
      return { success: false, message: "Order has already been claimed or is not pending" };
    }

    // Update order claimStatus and all products inside the order to CLAIMED
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { claimStatus: "PICKED_UP" },
      });

      const productIds = order.items.map(item => item.productId);
      
      if (productIds.length > 0) {
        await tx.product.updateMany({
          where: { id: { in: productIds } },
          data: { status: "CLAIMED" },
        });
      }
    });

    revalidatePath("/merchant");

    return { success: true, message: "Order claimed successfully!" };
  } catch (error) {
    console.error("Failed to claim order:", error);
    return { success: false, message: "An error occurred while claiming the order" };
  }
}
