import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product.types";
import { ProductDetailClient } from "./ProductDetailClient";
import Link from "next/link";
import { auth } from "@/auth";

export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const session = await auth();

  const dbProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      merchant: true,
      images: true,
    },
  });

  if (!dbProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p style={{ color: "#1E293B", fontWeight: 600 }}>Product not found</p>
        <Link href="/" style={{ color: "#2F5D50" }}>
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  const primaryImage = dbProduct.images.find((i) => i.isPrimary)?.imgUrl || dbProduct.images[0]?.imgUrl || "";
  const additionalImages = dbProduct.images.filter((i) => !i.isPrimary).map((i) => i.imgUrl);

  const product: Product = {
    id: dbProduct.id,
    name: dbProduct.title,
    merchantName: dbProduct.merchant.name,
    category: "All", // Adjust if you add category
    tier: dbProduct.tier === "TIER_1" ? "tier1" : "tier2",
    imageUrl: primaryImage,
    additionalImages,
    originalPrice: dbProduct.startPrice,
    discountedPrice: dbProduct.endPrice,
    aiScore: dbProduct.freshnessScore || 0,
    expiresAt: dbProduct.expiresAt.toISOString(),
    fullDescription: dbProduct.description,
    quantity: dbProduct.quantity,
    unit: "pcs",
  };

  return <ProductDetailClient product={product} isLoggedIn={!!session?.user} />;
}
