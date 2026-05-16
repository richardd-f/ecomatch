import { Leaf, ShoppingBag, Recycle } from "lucide-react";
import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

const STATS = [
  { value: "2.4M", label: "meals rescued to date" },
  { value: "63+", label: "partner merchants" },
  { value: "Free", label: "to join as a shopper" },
];

export default function RegisterPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-12 bg-[#F2EFE7]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#2F5D50" }}
            >
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#D4A373" }}
            >
              <ShoppingBag className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1
              className="text-2xl"
              style={{ color: "#1E293B", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Join <span style={{ color: "#2F5D50" }}>EcoMatch</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#1E293B70" }}>
              It takes 30 seconds. Food is waiting.
            </p>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl py-3 text-center border"
              style={{ backgroundColor: "white", borderColor: "#1E293B10" }}
            >
              <p style={{ color: "#2F5D50", fontWeight: 800, fontSize: "1rem" }}>
                {s.value}
              </p>
              <p className="text-xs mt-0.5 leading-tight" style={{ color: "#1E293B60" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-sm border"
          style={{ backgroundColor: "white", borderColor: "#1E293B15" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
              style={{ backgroundColor: "#A4B69A20", color: "#2F5D50", fontWeight: 600 }}
            >
              <ShoppingBag className="w-3 h-3" />
              Shopper Account
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
              style={{ backgroundColor: "#2F5D5010", color: "#2F5D50", fontWeight: 600 }}
            >
              <Recycle className="w-3 h-3" />
              Free forever
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl" style={{ color: "#1E293B", fontWeight: 700 }}>
              Create your shopper account
            </h2>
            <p className="text-sm mt-1" style={{ color: "#1E293B70" }}>
              Browse surplus food, claim deals, make a difference.
            </p>
          </div>

          <RegisterForm />

          <p className="text-sm text-center mt-5" style={{ color: "#1E293B70" }}>
            Already a shopper?{" "}
            <Link
              href="/login"
              style={{ color: "#2F5D50", fontWeight: 600 }}
              className="hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Merchant cross-link */}
        <div
          className="mt-4 rounded-xl px-5 py-3.5 flex items-center justify-between border"
          style={{ backgroundColor: "white", borderColor: "#1E293B10" }}
        >
          <p className="text-xs" style={{ color: "#1E293B70" }}>
            Want to list your surplus food?{" "}
            <Link
              href="/merchantRegister"
              style={{ color: "#2F5D50", fontWeight: 600 }}
              className="hover:underline"
            >
              Register as a Merchant →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
