"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ImpactMetrics } from "@/interfaces/impact.interface";

export async function getMerchantImpactMetricsAction(): Promise<{ success: boolean; data?: ImpactMetrics; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "MERCHANT") {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch all claimed products belonging to this merchant to calculate impact
    const claimedProducts = await prisma.product.findMany({
      where: {
        merchantId: session.user.id,
        status: "CLAIMED",
        estimatedVolume: { not: null }
      },
      select: {
        estimatedVolume: true,
        quantity: true
      }
    });

    let totalOrganicsSavedKg = 0;
    
    // Sum up the total weight (assuming estimatedVolume represents Kg/L for organics)
    // Multiplied by quantity if the volume was per unit. Assuming estimatedVolume is total per listing or we multiply by quantity for total impact.
    // The prompt says "total weight of organic waste from all completed listings".
    // Usually a listing has an estimated volume. Let's sum it directly if it represents the whole listing.
    claimedProducts.forEach(product => {
      if (product.estimatedVolume) {
        totalOrganicsSavedKg += product.estimatedVolume; // If it's per item, multiply by product.quantity, but typically volume is total for the listing. Let's just sum estimatedVolume.
      }
    });

    // U.S. EPA WARM factor for organic waste (food waste) composting/anaerobic digestion vs landfill is roughly 0.58 kg CO2e / kg.
    const EPA_WARM_FACTOR = 0.58;
    const carbonEmissionsPreventedKg = totalOrganicsSavedKg * EPA_WARM_FACTOR;

    return {
      success: true,
      data: {
        totalOrganicsSavedKg,
        carbonEmissionsPreventedKg
      }
    };
  } catch (error) {
    console.error("Failed to fetch impact metrics:", error);
    return { success: false, error: "Failed to fetch impact metrics" };
  }
}
