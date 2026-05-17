import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditProductForm } from "@/features/inventory/components/EditProductForm";

export const metadata = {
  title: "Edit Product | EcoMatch Merchant",
};

export default async function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== "MERCHANT") {
    redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: { isPrimary: 'desc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  if (product.merchantId !== session.user.id) {
    redirect("/merchant");
  }

  return (
    <div className="max-w-2xl mx-auto w-full pt-8 pb-16">
      <Link
        href="/merchant"
        className="flex items-center gap-2 text-sm text-[#1E293B]/60 hover:text-[#1E293B] transition-colors mb-6 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">Edit Listing</h1>
        <p className="text-sm text-[#1E293B]/60 mt-1">
          Update the details of your surplus food listing.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#1E293B]/10 p-8 shadow-sm">
        <EditProductForm productId={product.id} initialData={product} />
      </div>
    </div>
  );
}
