"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCheckoutSessionAction } from "../actions/checkout.actions";
import { CreditCard, Loader2 } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap: any;
  }
}

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load Midtrans Snap script dynamically
  useEffect(() => {
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const scriptUrl = isProduction 
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);

    const res = await createCheckoutSessionAction();
    
    if (res.error) {
      alert(res.error);
      setIsLoading(false);
      return;
    }

    if (res.snapToken) {
      window.snap.pay(res.snapToken, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: function (result: any) {
          console.log("Success:", result);
          router.push("/orders?status=success");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPending: function (result: any) {
          console.log("Pending:", result);
          router.push("/orders?status=pending");
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
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full py-4 rounded-xl bg-[#2F5D50] text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" /> Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" /> Pay Now
        </>
      )}
    </button>
  );
}
