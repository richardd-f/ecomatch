import { Product } from "../types/product.types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Surplus Bread Assortment",
    merchantName: "Local Bakery",
    category: "Bakery",
    tier: "tier1",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
    additionalImages: [],
    originalPrice: 50000,
    discountedPrice: 20000,
    aiScore: 9,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    fullDescription: "A selection of today's freshly baked bread that wasn't sold. Perfectly fine to eat!",
    quantity: 5,
    unit: "bags",
  },
  {
    id: "2",
    name: "Vegetable Box",
    merchantName: "Green Grocer",
    category: "Vegetables",
    tier: "tier2",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop",
    additionalImages: [],
    originalPrice: 30000,
    discountedPrice: 0,
    aiScore: 7,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    fullDescription: "Mixed vegetables with minor cosmetic blemishes. Still nutritious and delicious. Claim for free!",
    quantity: 2,
    unit: "boxes",
  }
];
