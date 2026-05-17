import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sprout } from "lucide-react";
import Link from "next/link";
import { ClaimCard } from "@/features/inventory/components/ClaimCard";
import { ClaimedItem } from "@/interfaces/claim.interface";

export const metadata = {
  title: "My Claims | EcoMatch",
};

export default async function MyClaimsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch only TIER_2 (Free Claims) for this buyer
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        userId: session.user.id,
      },
      product: {
        tier: "TIER_2",
      },
    },
    include: {
      product: true,
      order: true,
    },
    orderBy: {
      order: {
        createdAt: "desc",
      },
    },
  });

  const claimedItems: ClaimedItem[] = orderItems.map((item) => ({
    id: item.id,
    transactionId: item.order.id, // Using Order ID for the Handover QR Code
    product: {
      title: item.product.title,
      description: item.product.description,
      estimatedVolume: item.product.estimatedVolume,
      ecologicalClassification: item.product.ecologicalClassification,
      pickupNotes: item.product.pickupNotes,
    },
    quantity: item.quantity,
    status: item.order.claimStatus,
    createdAt: item.order.createdAt,
  }));

  return (
    <div className="max-w-4xl mx-auto w-full pt-8 pb-16 px-4 flex-grow flex flex-col min-h-screen bg-[#F2EFE7]">
      <div className="mb-8 pt-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">
          My Organic Claims
        </h1>
        <p className="text-sm text-[#1E293B]/60 mt-1">
          Manage your tier-two surplus rescues and handover tickets.
        </p>
      </div>

      {claimedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#1E293B]/10 p-12 flex flex-col items-center justify-center text-center shadow-sm flex-grow">
          <div className="w-16 h-16 bg-[#F2EFE7] rounded-full flex items-center justify-center mb-4">
            <Sprout className="w-8 h-8 text-[#1E293B]/40" />
          </div>
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">No claims yet</h2>
          <p className="text-[#1E293B]/60 mb-6 max-w-sm">
            You haven&apos;t claimed any organic waste. Explore the catalog to rescue surplus organics!
          </p>
          <Link
            href="/catalog"
            className="px-6 py-3 rounded-xl bg-[#2F5D50] text-white font-medium hover:bg-[#A4B69A] transition-colors"
          >
            Find Organics
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {claimedItems.map((item) => (
            <ClaimCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
