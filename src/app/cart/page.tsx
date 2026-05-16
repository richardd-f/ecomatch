import { auth } from "@/auth";
import { getCartAction } from "@/features/cart/actions/cart.actions";
import { CartList } from "@/features/cart/components/CartList";
import { ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your Cart | EcoMatch",
};

export default async function CartPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const cart = await getCartAction();
  const items = (cart as any)?.items || [];

  return (
    <div className="max-w-4xl mx-auto w-full pt-8 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#2F5D50] flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">
          Your Rescued Items
        </h1>
      </div>

      <CartList initialItems={items} />
    </div>
  );
}
