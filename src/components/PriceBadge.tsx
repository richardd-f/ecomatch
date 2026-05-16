import { ProductTier } from "../types/product.types";

interface PriceBadgeProps {
  tier: ProductTier;
  originalPrice: number;
  discountedPrice: number;
  size?: "sm" | "md" | "lg";
}

const IDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export function PriceBadge({ tier, originalPrice, discountedPrice, size = "md" }: PriceBadgeProps) {
  if (tier === "tier2") {
    return (
      <div className={`flex items-center ${size === "lg" ? "gap-2" : "gap-1"}`}>
        <span
          style={{
            color: "#A4B69A",
            fontWeight: 800,
            fontSize: size === "lg" ? "1.5rem" : size === "md" ? "1.125rem" : "1rem",
          }}
        >
          FREE
        </span>
        <span
          className="line-through"
          style={{
            color: "#1E293B50",
            fontSize: size === "lg" ? "1rem" : size === "md" ? "0.875rem" : "0.75rem",
          }}
        >
          {IDR(originalPrice)}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${size === "lg" ? "gap-2" : "gap-1"}`}>
      <span
        style={{
          color: "#D4A373",
          fontWeight: 800,
          fontSize: size === "lg" ? "1.5rem" : size === "md" ? "1.125rem" : "1rem",
        }}
      >
        {IDR(discountedPrice)}
      </span>
      <span
        className="line-through"
        style={{
          color: "#1E293B50",
          fontSize: size === "lg" ? "1rem" : size === "md" ? "0.875rem" : "0.75rem",
        }}
      >
        {IDR(originalPrice)}
      </span>
    </div>
  );
}
