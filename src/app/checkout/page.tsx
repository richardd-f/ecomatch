import { auth } from "@/auth";
import { getCartAction } from "@/features/cart/actions/cart.actions";
import { redirect } from "next/navigation";
import { ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "@/features/checkout/components/CheckoutButton";
import { PriceBadge } from "@/components/PriceBadge";

export const metadata = {
  title: "Checkout | EcoMatch",
};

export default async function CheckoutPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const cart = await getCartAction();
  const items = (cart as any)?.items || [];

  if (items.length === 0) {
    redirect("/cart");
  }

  const subtotal = items.reduce((total: number, item: any) => {
    if (item.product.tier === "TIER_2") return total;
    return total + item.product.endPrice * item.quantity;
  }, 0);

  const serviceFee = 0;
  const total = subtotal + serviceFee;

  return (
    <div className="max-w-3xl mx-auto w-full pt-8 pb-16">
      <Link
        href="/cart"
        className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-70 w-fit mb-6 text-[#1E293B]/60 hover:text-[#1E293B]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">
          Checkout
        </h1>
        <p className="text-sm text-[#1E293B]/60 mt-1">
          Review your rescued items and complete your payment safely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Items */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#1E293B]/10 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#1E293B]/10 bg-[#F2EFE7]/30">
              <h2 className="font-bold text-[#1E293B]">Order Items ({items.length})</h2>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              {items.map((item: any) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#F2EFE7] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6 text-[#1E293B]/20" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-[#1E293B] text-sm line-clamp-1">{item.product.title}</h3>
                    <p className="text-xs text-[#1E293B]/60 mt-0.5 mb-1.5">
                      from {item.product.merchant.name}
                    </p>
                    <PriceBadge 
                      tier={item.product.tier as any}
                      originalPrice={item.product.startPrice}
                      discountedPrice={item.product.endPrice}
                      size="sm"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1E293B]">x{item.quantity}</p>
                    {item.product.tier !== "TIER_2" && (
                      <p className="text-sm font-bold text-[#1E293B] mt-1">
                        Rp {(item.product.endPrice * item.quantity).toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Payment Summary */}
        <div className="md:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-[#1E293B]/10 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1E293B] mb-4">Payment Details</h2>
            
            <div className="flex flex-col gap-3 pb-4 border-b border-[#1E293B]/10 text-sm">
              <div className="flex justify-between text-[#1E293B]/70">
                <span>Subtotal</span>
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
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="mt-2 mb-4 flex items-center gap-2 text-xs text-[#2F5D50] bg-[#2F5D50]/10 px-3 py-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Payments are processed securely via Midtrans.</span>
            </div>

            <CheckoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}