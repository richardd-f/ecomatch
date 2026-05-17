import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ScannerClient } from "@/features/transactions/components/ScannerClient";

export const metadata = {
  title: "Scan Handover | EcoMatch Merchant",
};

export default async function MerchantScanPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "MERCHANT") {
    redirect("/merchantLogin");
  }

  return (
    <div className="flex-grow flex flex-col items-center pt-10 pb-16 px-4 bg-[#F2EFE7] min-h-screen">
      
      {/* Decorative top section */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative w-20 h-20 bg-white rounded-full p-2 shadow-sm border border-[#1E293B]/10 overflow-hidden">
          <Image 
            src="/images/logo/Logo_Ecomatch_Baru-removebg-preview.png" 
            alt="EcoMatch Logo" 
            fill
            className="object-contain p-2"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Handover Scanner</h1>
          <p className="text-sm text-[#1E293B]/60 mt-1 max-w-xs mx-auto">
            Process physical handover of organic waste by scanning the buyer&apos;s unique QR code.
          </p>
        </div>
      </div>

      {/* Decorative element (CSS gradient fallback since asset folder is empty) */}
      <div className="w-full max-w-md relative mb-4 h-32 rounded-2xl overflow-hidden shadow-sm bg-gradient-to-tr from-[#2F5D50] to-[#A4B69A]">
        <div className="absolute inset-0 flex items-end p-4">
          <p className="text-white font-bold text-lg drop-shadow-md">Verified Handover Process</p>
        </div>
      </div>

      <ScannerClient />

    </div>
  );
}
