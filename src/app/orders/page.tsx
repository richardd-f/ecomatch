"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Suspense } from "react";

function OrdersContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div className="max-w-xl mx-auto w-full pt-20 pb-16 text-center flex flex-col items-center">
      {status === "success" ? (
        <>
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2">Payment Successful!</h1>
          <p className="text-[#1E293B]/60 mb-8">
            Thank you for rescuing this food. Your order has been placed. 
            Please check your email for the receipt and pickup instructions.
          </p>
        </>
      ) : status === "pending" ? (
        <>
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2">Payment Pending</h1>
          <p className="text-[#1E293B]/60 mb-8">
            Your order is awaiting payment confirmation. You can check the status again later.
          </p>
        </>
      ) : (
        <>
          <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2">Your Orders</h1>
          <p className="text-[#1E293B]/60 mb-8">
            You will be able to view all your past and active orders here.
          </p>
        </>
      )}

      <Link
        href="/"
        className="px-8 py-4 rounded-xl bg-[#2F5D50] text-white font-bold hover:opacity-90 transition-opacity"
      >
        Return to Marketplace
      </Link>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
