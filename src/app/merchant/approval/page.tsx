import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ApprovalForm } from "@/components/merchant/ApprovalForm";

export const metadata = {
  title: "Draft Approval | EcoMatch Merchant",
};

export default function MerchantApprovalPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse initial data from AI draft in query params
  const initialData = {
    title: searchParams.title as string || "",
    description: searchParams.description as string || "",
    startPrice: Number(searchParams.startPrice) || 0,
    endPrice: Number(searchParams.endPrice) || 0,
    tier: (searchParams.tier as "TIER_1" | "TIER_2") || "TIER_1",
    quantity: Number(searchParams.quantity) || 1,
    category: searchParams.category as string || "Vegetables",
  };
  
  const imageUrl = searchParams.imageUrl as string | undefined;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-16">
      <Link
        href="/merchant/products/new"
        className="flex items-center gap-2 text-sm text-[#1E293B]/60 hover:text-[#1E293B] transition-colors mb-6 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Generator
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">Review Draft</h1>
        <p className="text-sm text-[#1E293B]/60 mt-1">
          Review and finalize the AI-generated details before publishing.
        </p>
      </div>

      <ApprovalForm initialData={initialData} imageUrl={imageUrl} />
    </div>
  );
}
