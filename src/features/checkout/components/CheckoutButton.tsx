"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";
import { finalizeCheckoutAction } from "../actions/checkout.actions";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snap: any;
  }
}

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentActive, setIsPaymentActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    setErrorMessage("");

    try {
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
      });
      const res = await response.json();

      if (!response.ok || res.error) {
        setErrorMessage(res.error || "Failed to generate checkout session");
        setIsLoading(false);
        return;
      }

      if (res.isFree) {
        // Order was handled entirely on the server
        router.push("/myItems?status=success");
        return;
      }

      if (res.snapToken) {
        setIsPaymentActive(true);
        window.snap.pay(res.snapToken, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: async function (result: any) {
            console.log("Success:", result);
            if (res.orderId) {
              await finalizeCheckoutAction(res.orderId, result.transaction_id);
            }
            setIsPaymentActive(false);
            router.push("/myItems?status=success");
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onPending: function (result: any) {
            console.log("Pending:", result);
            setIsPaymentActive(false);
            router.push("/myItems?status=pending");
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: function (result: any) {
            console.log("Error:", result);
            setErrorMessage("Payment failed!");
            setIsPaymentActive(false);
            setIsLoading(false);
          },
          onClose: function () {
            console.log("Customer closed the popup without finishing the payment");
            setIsPaymentActive(false);
            setIsLoading(false);
          },
        });
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isPaymentActive && (
        <div className="fixed inset-0 z-[9998] bg-[#F2EFE7]/40 backdrop-blur-md transition-all duration-300 pointer-events-none" />
      )}
      
      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: "#D4A37315", border: "1px solid #D4A37330" }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#D4A373" }} />
          <p className="text-sm" style={{ color: "#D4A373", fontWeight: 500 }}>{errorMessage}</p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full py-4 rounded-xl bg-[#2F5D50] text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 relative z-10"
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
    </>
  );
}
