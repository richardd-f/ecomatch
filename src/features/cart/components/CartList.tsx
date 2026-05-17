"use client";

import { useState, useTransition, useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { updateCartItemQuantityAction, removeCartItemAction } from "../actions/cart.actions";
import Link from "next/link";
import { PriceBadge } from "@/components/PriceBadge";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";

// Define local types matching what Prisma returns
type CartItemWithProduct = {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    startPrice: number;
    endPrice: number;
    tier: string;
    quantity: number;
    merchant: {
      name: string;
    };
    images?: {
      id: string;
      imgUrl: string;
      isPrimary: boolean;
    }[];
  };
};

type CartItemExtended = CartItemWithProduct & { originalQty?: number };

export function CartList({ initialItems }: { initialItems: CartItemWithProduct[] }) {
  const [items, setItems] = useState<CartItemExtended[]>(() => 
    initialItems.map(item => {
      if (item.quantity > item.product.quantity) {
        return { ...item, originalQty: item.quantity, quantity: item.product.quantity };
      }
      return item;
    })
  );
  
  const [isPending, startTransition] = useTransition();

  // If we adjusted quantities, sync with backend on mount
  useEffect(() => {
    items.forEach(item => {
      if (item.originalQty) {
        void updateCartItemQuantityAction(item.id, item.quantity);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <FadeIn delay={0.1}>
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#F2EFE7] text-[#A4B69A] mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#1E293B] mb-2">Your cart is empty</h2>
        <p className="text-[#1E293B]/60 mb-6 max-w-sm">
          You haven&apos;t rescued any food yet. Browse the marketplace to find delicious surplus food!
        </p>
        <Link 
          href="/"
          className="px-6 py-3 rounded-xl bg-[#2F5D50] text-white font-medium hover:opacity-90 transition-opacity"
        >
          Browse Marketplace
        </Link>
      </div>
      </FadeIn>
    );
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Find the item to check its max quantity
    const targetItem = items.find(i => i.id === itemId);
    if (!targetItem) return;

    // Enforce max quantity limit
    const finalQuantity = Math.min(newQuantity, targetItem.product.quantity);
    
    // Optimistic update
    setItems((current) => 
      current.map(item => item.id === itemId ? { ...item, quantity: finalQuantity, originalQty: undefined } : item)
    );

    startTransition(async () => {
      const res = await updateCartItemQuantityAction(itemId, finalQuantity);
      if (res?.error) {
        window.location.reload();
      }
    });
  };

  const handleRemove = (itemId: string) => {
    // Optimistic update
    setItems((current) => current.filter(item => item.id !== itemId));

    startTransition(async () => {
      const res = await removeCartItemAction(itemId);
      if (res?.error) {
        window.location.reload();
      }
    });
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      // Free items contribute 0
      if (item.product.tier === "TIER_2") return total;
      return total + (item.product.endPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Cart Items List */}
      <StaggerContainer delay={0.1} className="lg:col-span-2 flex flex-col gap-4">
        {items.map((item) => (
          <StaggerItem key={item.id}>
          <div 
            className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white border border-[#1E293B]/10 shadow-sm"
          >
            {/* Product Image */}
            <div className="w-full sm:w-28 h-28 rounded-xl bg-[#F2EFE7] overflow-hidden flex items-center justify-center shrink-0">
              {(() => {
                const imgUrl = item.product.images?.find(img => img.isPrimary)?.imgUrl || item.product.images?.[0]?.imgUrl;
                return imgUrl ? (
                  <img src={imgUrl} alt={item.product.title} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-[#1E293B]/20" />
                );
              })()}
            </div>
            
            <div className="flex flex-col flex-grow justify-between gap-3">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-[#1E293B] line-clamp-2">{item.product.title}</h3>
                  <p className="text-sm text-[#1E293B]/60 mt-1">
                    from {item.product.merchant.name}
                  </p>
                  {(item as CartItemExtended).originalQty && (
                    <div className="text-red-500 text-xs mt-1.5 font-semibold bg-red-50 px-2 py-1 rounded-md inline-block">
                      Reduced from {(item as CartItemExtended).originalQty} (Only {item.product.quantity} left)
                    </div>
                  )}
                  <div className="mt-2">
                    <PriceBadge 
                      tier={item.product.tier as "tier1" | "tier2"} 
                      originalPrice={item.product.startPrice} 
                      discountedPrice={item.product.endPrice} 
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => handleRemove(item.id)}
                  disabled={isPending}
                  className="p-2 text-[#1E293B]/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-auto">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-[#F2EFE7] rounded-lg p-1 border border-[#1E293B]/5">
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={isPending || item.quantity <= 1}
                    className="p-1.5 rounded-md hover:bg-white text-[#1E293B]/70 disabled:opacity-50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold text-[#1E293B] min-w-[1.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isPending || item.quantity >= item.product.quantity}
                    className="p-1.5 rounded-md hover:bg-white text-[#1E293B]/70 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right">
                  {item.product.tier === "TIER_2" ? (
                    <span className="font-bold text-[#A4B69A]">FREE</span>
                  ) : (
                    <span className="font-bold text-[#1E293B]">
                      Rp {(item.product.endPrice * item.quantity).toLocaleString("id-ID")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <FadeIn delay={0.3}>
        <div className="sticky top-24 bg-white rounded-2xl border border-[#1E293B]/10 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">Order Summary</h2>
          
          <div className="flex flex-col gap-3 pb-4 border-b border-[#1E293B]/10">
            <div className="flex justify-between text-[#1E293B]/70">
              <span>Subtotal ({items.length} items)</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-[#1E293B]/70">
              <span>Service Fee</span>
              <span>Rp 0</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-4">
            <span className="font-bold text-[#1E293B]">Total</span>
            <span className="text-xl font-extrabold text-[#1E293B]">
              Rp {subtotal.toLocaleString("id-ID")}
            </span>
          </div>

          <Link 
            href="/checkout"
            className="w-full py-3.5 rounded-xl bg-[#2F5D50] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            Proceed to Checkout
          </Link>

          <p className="text-xs text-center text-[#1E293B]/50 mt-4">
            By proceeding, you agree to rescue this food. Please pick it up before the expiration time!
          </p>
        </div>
        </FadeIn>
      </div>
    </div>
  );
}
