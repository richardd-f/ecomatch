import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product.types";
import { HomeClient } from "./HomeClient";

export default async function Home() {
  // Fetch available products
  const dbProducts = await prisma.product.findMany({
    where: { 
      status: "AVAILABLE",
      expiresAt: {
        gt: new Date()
      }
    },
    include: {
      merchant: true,
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Map to the Product interface expected by frontend
  const products: Product[] = dbProducts.map((p) => {
    const primaryImage = p.images.find((i) => i.isPrimary)?.imgUrl || p.images[0]?.imgUrl || "";
    const additionalImages = p.images.filter((i) => !i.isPrimary).map((i) => i.imgUrl);

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
    };
  });

  return <HomeClient products={products} />;
}