"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  Gift,
  Clock,
  Store,
  Minus,
  Plus,
  Leaf,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MOCK_PRODUCTS } from "../../../data/mockProducts";
import { PriceBadge } from "../../../components/PriceBadge";
import { Product } from "../../../types/product.types";

const IDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

function timeUntil(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)} days`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} minutes`;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.productId as string;
  const router = useRouter();
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p style={{ color: "#1E293B", fontWeight: 600 }}>Product not found</p>
        <Link href="/" style={{ color: "#2F5D50" }}>
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...product.additionalImages];
  const isFree = product.tier === "tier2";
  const savings = product.originalPrice - product.discountedPrice;
  const savingsPct = Math.round((savings / product.originalPrice) * 100);

  const handleAddToCart = () => {
    console.log("Added to cart", product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-70 w-fit"
        style={{ color: "#1E293B70" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
            <img
              src={allImages[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Tier badge */}
            <div className="absolute top-3 left-3">
              <span
                className="px-3 py-1 rounded-full text-white text-xs"
                style={{
                  backgroundColor: isFree ? "#A4B69A" : "#D4A373",
                  fontWeight: 700,
                }}
              >
                {isFree ? "✨ FREE CLAIM" : `🏷 SAVE ${savingsPct}%`}
              </span>
            </div>
            {/* Nav arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((v) => (v - 1 + allImages.length) % allImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow transition-opacity hover:opacity-90"
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: "#1E293B" }} />
                </button>
                <button
                  onClick={() => setActiveImg((v) => (v + 1) % allImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow transition-opacity hover:opacity-90"
                >
                  <ChevronRight className="w-4 h-4" style={{ color: "#1E293B" }} />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0"
                  style={{ borderColor: activeImg === i ? "#2F5D50" : "transparent" }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-3.5 h-3.5" style={{ color: "#2F5D50" }} />
              <span className="text-xs" style={{ color: "#2F5D50", fontWeight: 600 }}>
                {product.merchantName}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#F2EFE7", color: "#1E293B70" }}
              >
                {product.category}
              </span>
            </div>
            <h1
              className="leading-tight"
              style={{ color: "#1E293B", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.02em" }}
            >
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <PriceBadge
            tier={product.tier}
            originalPrice={product.originalPrice}
            discountedPrice={product.discountedPrice}
            size="lg"
          />

          {/* AI Score badge */}
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ backgroundColor: "#F2EFE7" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#2F5D50" }}
            >
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#1E293B80" }}>
                Gemini Vision AI Freshness Score
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          i < product.aiScore
                            ? i < 4
                              ? "#D4A373"
                              : "#2F5D50"
                            : "#1E293B15",
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs" style={{ color: "#1E293B", fontWeight: 700 }}>
                  {product.aiScore}/10
                </span>
              </div>
            </div>
          </div>

          {/* Expiry */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: "#D4A37315", border: "1px solid #D4A37330" }}
          >
            <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#D4A373" }} />
            <span className="text-sm" style={{ color: "#D4A373", fontWeight: 600 }}>
              Available for {timeUntil(product.expiresAt)} — claim before it expires!
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm mb-2" style={{ color: "#1E293B", fontWeight: 700 }}>
              About this listing
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#1E293B80" }}>
              {product.fullDescription}
            </p>
          </div>

          {/* Quantity + CTA */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: "#1E293B", fontWeight: 500 }}>
                Quantity
              </span>
              <div
                className="flex items-center gap-2 px-2 py-1 rounded-lg border"
                style={{ borderColor: "#1E293B20" }}
              >
                <button
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-gray-100"
                >
                  <Minus className="w-3.5 h-3.5" style={{ color: "#1E293B" }} />
                </button>
                <span
                  className="w-6 text-center text-sm"
                  style={{ color: "#1E293B", fontWeight: 600 }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty((v) => Math.min(product.quantity, v + 1))}
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-gray-100"
                >
                  <Plus className="w-3.5 h-3.5" style={{ color: "#1E293B" }} />
                </button>
              </div>
              <span className="text-xs" style={{ color: "#1E293B50" }}>
                {product.quantity} {product.unit} available
              </span>
            </div>

            {!isFree && qty > 1 && (
              <p className="text-xs" style={{ color: "#D4A373", fontWeight: 500 }}>
                Subtotal: {IDR(product.discountedPrice * qty)}
              </p>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-xl text-white flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: added ? "#A4B69A" : isFree ? "#A4B69A" : "#2F5D50",
                fontWeight: 700,
                fontSize: "0.9375rem",
                transform: added ? "scale(0.98)" : "scale(1)",
              }}
            >
              {added ? (
                <>✓ Added to Cart</>
              ) : isFree ? (
                <>
                  <Gift className="w-5 h-5" /> Claim for Free
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </>
              )}
            </button>

            {isFree && (
              <p className="text-xs text-center" style={{ color: "#1E293B60" }}>
                This item is completely free — just pick it up from the merchant.
              </p>
            )}

            {!isFree && savings > 0 && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#2F5D5015", border: "1px solid #2F5D5020" }}
              >
                <Zap className="w-4 h-4" style={{ color: "#2F5D50" }} />
                <span style={{ color: "#2F5D50", fontWeight: 500 }}>
                  You save {IDR(savings * qty)} ({savingsPct}% off) vs. original price
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
