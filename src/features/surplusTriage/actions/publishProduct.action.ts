"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function publishProductAction(data: {
  title: string;
  description: string;
  dynamicPrice: number;
  tier: string;
  quantity: number;
  freshnessScore: number;
  imageUrl: string | null;
}) {
  try {
    const session = await auth();
    let merchantId = session?.user?.id;

    // Use dummy merchant if user is not authenticated or session doesn't have ID
    if (!merchantId) {
      console.warn("User not authenticated. Using a dummy merchant for product creation.");
      const dummyMerchant = await prisma.user.findFirst({
        where: { role: "MERCHANT" },
      });

      if (!dummyMerchant) {
        throw new Error(
          "No merchant found in the database. Please ensure your database is seeded with at least one MERCHANT user."
        );
      }
      merchantId = dummyMerchant.id;
    }

    // Determine the tier enum value
    const dbTier = data.tier === "Tier 1" ? "TIER_1" : "TIER_2";

    // Set expiry to 24 hours from now as a default
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const product = await prisma.product.create({
      data: {
        merchantId,
        title: data.title,
        description: data.description,
        startPrice: data.dynamicPrice,
        endPrice: data.dynamicPrice,
        tier: dbTier,
        status: "AVAILABLE",
        quantity: data.quantity,
        freshnessScore: data.freshnessScore,
        expiresAt,
        images: data.imageUrl
          ? {
              create: {
                imgUrl: data.imageUrl,
                isPrimary: true,
              },
            }
          : undefined,
      },
    });

    // Revalidate paths so the new product shows up immediately
    revalidatePath("/merchant");
    revalidatePath("/merchant/products");

    return { success: true, productId: product.id };
  } catch (error) {
    console.error("Failed to publish product:", error);
    return { success: false, error: "Failed to publish product to the database." };
  }
}
