import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MerchantDashboard } from "@/features/merchant/components/MerchantDashboard";

export const metadata = {
  title: "Merchant Dashboard | EcoMatch",
};

export default async function MerchantPage() {
  const session = await auth();

  // Redirect if not logged in or not a merchant
  if (!session?.user || session.user.role !== "MERCHANT") {
    redirect("/merchantLogin");
  }

  // Fetch products associated with this merchant
  const products = await prisma.product.findMany({
    where: { merchantId: session.user.id },
    include: {
      images: {
        select: {
          imgUrl: true,
          isPrimary: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto w-full pt-8 pb-16">
      <MerchantDashboard initialProducts={products} />
    </div>
  );
}