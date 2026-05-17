export type ProductTier = "tier1" | "tier2";

export interface Product {
  id: string;
  name: string;
  merchantName: string;
  category: string;
  tier: ProductTier;
  imageUrl: string;
  additionalImages: string[];
  originalPrice: number;
  discountedPrice: number;
  aiScore: number;
  expiresAt: string;
  fullDescription: string;
  quantity: number;
  unit: string;
  distanceKm?: number;
}
