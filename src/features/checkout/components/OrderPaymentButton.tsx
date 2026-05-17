"use client";

import { useState, useEffect } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderPaymentButtonProps {
  snapToken: string;
}

export function OrderPaymentButton({ snapToken }: OrderPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load Midtrans Snap script dynamically
  useEffect(() => {
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const scriptUrl = isProduction 
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    // Check if script is already injected
    if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);

    if (window.snap) {
      window.snap.pay(snapToken, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: function (result: any) {
          console.log("Success:", result);
          router.refresh(); // Refresh the page to get the updated status (once webhook hits)
          setIsLoading(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPending: function (result: any) {
          console.log("Pending:", result);
          router.refresh();
          setIsLoading(false);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: function (result: any) {
          console.log("Error:", result);
          alert("Payment failed!");
          setIsLoading(false);
        },
        onClose: function () {
          console.log("Customer closed the popup without finishing the payment");
          setIsLoading(false);
        },
      });
    } else {
      alert("Midtrans snap script is not loaded yet. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#2F5D50] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm disabled:opacity-70"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Processing
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" /> Pay Now
        </>
      )}
    </button>
  );
}
