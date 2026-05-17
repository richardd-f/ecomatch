"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notifyNearbyUsersAction } from "@/features/notifications/actions/notification.actions";

export async function publishProductAction(data: {
  title: string;
  description: string;
  startPrice: number;
  endPrice: number;
  tier: "TIER_1" | "TIER_2";
  quantity: number;
  category: string;
  imageUrl?: string;
  expiresAt: string;
  merchantLat?: number;
  merchantLon?: number;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "MERCHANT") {
    return { error: "Unauthorized" };
  }

  try {
    const product = await prisma.product.create({
      data: {
        merchantId: session.user.id,
        title: data.title,
        description: data.description,
        startPrice: data.startPrice,
        endPrice: data.endPrice,
        tier: data.tier,
        quantity: data.quantity,
        expiresAt: new Date(data.expiresAt),
        status: "AVAILABLE",
        // Create a primary image if provided
        ...(data.imageUrl && {
          images: {
            create: {
              imgUrl: data.imageUrl,
              isPrimary: true,
            },
          },
        }),
      },
    });

    // Notify nearby users if coordinates are provided
    if (data.merchantLat && data.merchantLon) {
      await notifyNearbyUsersAction(data.merchantLat, data.merchantLon, {
        title: "New Organic Waste Available!",
        body: `${data.title} is available near you.`,
        url: `/product/${product.id}`,
      });
    }

    return { success: true, productId: product.id };
  } catch (error) {
    console.error("Failed to publish product:", error);
    return { error: "Failed to publish listing" };
  }
}
