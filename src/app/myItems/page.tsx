import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OrderCard } from "@/features/marketplace/components/OrderCard";
import { PackageOpen } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Items | EcoMatch",
};

export default async function MyItemsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto w-full pt-8 pb-16 px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">
          My Items
        </h1>
        <p className="text-sm text-[#1E293B]/60 mt-1">
          View your orders, manage payments, and get your QR codes for pickup.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#1E293B]/10 p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-[#F2EFE7] rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 text-[#1E293B]/40" />
          </div>
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">No items yet</h2>
          <p className="text-[#1E293B]/60 mb-6 max-w-sm">
            You haven't rescued any food yet. Explore the marketplace to find delicious deals and fight food waste!
          </p>
          <Link
            href="/catalog"
            className="px-6 py-3 rounded-xl bg-[#2F5D50] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Start Rescuing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}