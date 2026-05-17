import Link from "next/link";
import { Product } from "../types/product.types";
import { PriceBadge } from "./PriceBadge";
import { StaggerContainer } from "./animations/StaggerContainer";
import { StaggerItem } from "./animations/StaggerItem";
import { ShoppingBag } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product, qty: number) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center" style={{ color: "#1E293B60" }}>
        No products found matching your criteria.
      </div>
    );
  }

  return (
    <StaggerContainer delay={0.4} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <StaggerItem key={product.id} className="h-full">
          <Link
            href={`/product/${product.id}`}
            className="group flex flex-col h-full rounded-2xl overflow-hidden border transition-all hover:shadow-md"
          style={{ backgroundColor: "white", borderColor: "#1E293B15" }}
        >
          <div className="relative aspect-square overflow-hidden bg-[#F2EFE7] flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <ShoppingBag className="w-12 h-12 text-[#1E293B]/20" />
            )}
            {product.tier === "tier2" && (
              <div className="absolute top-2 left-2">
                <span
                  className="px-2 py-1 rounded-md text-white text-[10px]"
                  style={{ backgroundColor: "#A4B69A", fontWeight: 700 }}
                >
                  FREE
                </span>
              </div>
            )}
          </div>
          <div className="p-3 flex flex-col gap-1 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] uppercase truncate" style={{ color: "#2F5D50", fontWeight: 600 }}>
                {product.merchantName}
              </span>
            </div>
            <h3 className="text-sm line-clamp-2" style={{ color: "#1E293B", fontWeight: 700, lineHeight: 1.3 }}>
              {product.name}
            </h3>
            <div className="mt-auto pt-2">
              <PriceBadge
                tier={product.tier}
                originalPrice={product.originalPrice}
                discountedPrice={product.discountedPrice}
                size="sm"
              />
            </div>
          </div>
        </Link>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
