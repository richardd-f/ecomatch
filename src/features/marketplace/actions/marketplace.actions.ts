"use server";

import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product.types";
import { calculateHaversineDistance } from "../utils/haversine";

export async function getMarketplaceListingsAction(
  userLat?: number,
  userLng?: number
): Promise<{ success: boolean; data?: Product[]; error?: string }> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        status: "AVAILABLE",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        merchant: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const products: Product[] = dbProducts.map((p) => {
      const primaryImage =
        p.images.find((i) => i.isPrimary)?.imgUrl || p.images[0]?.imgUrl || "";
      const additionalImages = p.images
        .filter((i) => !i.isPrimary)
        .map((i) => i.imgUrl);

      let distanceKm: number | undefined;
      
      // Calculate distance if both user and merchant have coordinates
      if (
        userLat != null &&
        userLng != null &&
        p.merchant.latitude != null &&
        p.merchant.longitude != null
      ) {
        distanceKm = calculateHaversineDistance(
          userLat,
          userLng,
          p.merchant.latitude,
          p.merchant.longitude
        );
      }

      return {
        id: p.id,
        name: p.title,
        merchantName: p.merchant.name,
        category: "All", // Categories aren't implemented in DB yet, defaulting
        tier: p.tier === "TIER_1" ? "tier1" : "tier2",
        imageUrl: primaryImage,
        additionalImages,
        originalPrice: p.startPrice,
        discountedPrice: p.endPrice,
        aiScore: p.freshnessScore || 0,
        expiresAt: p.expiresAt.toISOString(),
        fullDescription: p.description,
        quantity: p.quantity,
        unit: "pcs", // Default unit
        distanceKm,
      };
    });

    // If coordinates were provided, optionally sort by distance (closest first)
    if (userLat != null && userLng != null) {
      products.sort((a, b) => {
        const distA = a.distanceKm ?? Number.MAX_VALUE;
        const distB = b.distanceKm ?? Number.MAX_VALUE;
        return distA - distB;
      });
    }

    return { success: true, data: products };
  } catch (error) {
    console.error("Failed to fetch marketplace listings:", error);
    return { success: false, error: "Failed to fetch listings" };
  }
}
