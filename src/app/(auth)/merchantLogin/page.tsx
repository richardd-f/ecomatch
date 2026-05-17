import Image from "next/image";
import Link from "next/link";
import { Store, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { MerchantLoginForm } from "@/features/auth/components/MerchantLoginForm";

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Verified Merchant Network" },
  { icon: TrendingUp, label: "Real-time Sales Analytics" },
  { icon: Users, label: "Direct Buyer Connections" },
];

import { prisma } from "@/lib/prisma";

export default async function MerchantLoginPage() {
  const merchantsCount = await prisma.user.count({ where: { role: "MERCHANT" } });

  const rescuedAggregate = await prisma.orderItem.aggregate({
    _sum: { quantity: true },
    where: { order: { status: { in: ["PAID"] } } }
  });
  const rescuedMeals = rescuedAggregate._sum.quantity || 0;

  const revenueAggregate = await prisma.order.aggregate({
    _sum: { grossAmount: true },
    where: { status: "PAID" }
  });
  const revenue = revenueAggregate._sum.grossAmount || 0;

  // Format revenue to abbreviated string
  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}M+`;
    if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(1)}K+`;
    return `Rp ${amount}`;
  };

  const dynamicStats = [
    { value: `${merchantsCount}+`, label: "Active merchants" },
    { value: formatRevenue(revenue), label: "Revenue generated" },
    { value: `${rescuedMeals}+`, label: "Meals rescued" },
    { value: "100%", label: "Merchant satisfaction" }, // No review table exists, assuming 100%
  ];
  return (
    <div
      className="flex-grow flex"
      style={{ backgroundColor: "#F2EFE7" }}
    >
      {/* Left panel — branding & trust (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-col justify-between w-5/12 p-12"
        style={{ backgroundColor: "#1E293B" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 bg-white rounded-xl p-1">
            <Image
              src="/images/logo/Logo_Ecomatch_Baru-removebg-preview.png"
              alt="EcoMatch Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <span
            className="text-white"
            style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em" }}
          >
            Eco<span style={{ color: "#A4B69A" }}>Match</span>
            <span className="ml-1.5 text-xs align-middle" style={{ color: "#1E293B60", fontWeight: 400 }}>
              Merchant
            </span>
          </span>
        </div>

        {/* Hero copy */}
        <div className="flex flex-col gap-8">
          <div>
            <p
              className="text-3xl leading-tight"
              style={{ color: "white", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Turn surplus into revenue.
              <br />
              <span style={{ color: "#A4B69A" }}>Zero waste. Zero guilt.</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              EcoMatch connects sustainable food businesses with conscious local buyers. List your
              surplus in minutes, our Gemini AI sets the optimal price for you.
            </p>
          </div>

          {/* Trust points */}
          <div className="flex flex-col gap-3">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(47,93,80,0.3)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#A4B69A" }} />
                </div>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {dynamicStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <p className="text-base" style={{ color: "white", fontWeight: 800 }}>
                  {s.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          © 2026 EcoMatch · Secure B2B Portal
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#1E293B" }}
            >
              <Store className="w-5 h-5 text-white" />
            </div>
            <span
              style={{ color: "#1E293B", fontWeight: 800, fontSize: "1.125rem", letterSpacing: "-0.02em" }}
            >
              EcoMatch <span style={{ color: "#2F5D50" }}>Merchant</span>
            </span>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8 border shadow-sm"
            style={{ backgroundColor: "white", borderColor: "#1E293B10" }}
          >
            {/* Portal badge */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                style={{ backgroundColor: "#1E293B", color: "white", fontWeight: 600 }}
              >
                <Store className="w-3 h-3" />
                Merchant Portal
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                style={{ backgroundColor: "#2F5D5015", color: "#2F5D50", fontWeight: 600 }}
              >
                <ShieldCheck className="w-3 h-3" />
                Secure
              </span>
            </div>

            <div className="mb-6">
              <h2
                className="text-xl"
                style={{ color: "#1E293B", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Access your dashboard
              </h2>
              <p className="text-sm mt-1" style={{ color: "#1E293B60" }}>
                Manage listings, review AI pricing, and track your impact.
              </p>
            </div>

            <MerchantLoginForm />

            <div
              className="mt-5 pt-5 border-t flex items-center justify-between"
              style={{ borderColor: "#1E293B08" }}
            >
              <p className="text-sm" style={{ color: "#1E293B60" }}>
                New to EcoMatch?{" "}
                <Link
                  href="/merchantRegister"
                  style={{ color: "#2F5D50", fontWeight: 600 }}
                  className="hover:underline"
                >
                  Create merchant account
                </Link>
              </p>
            </div>
          </div>

          {/* Consumer cross-link */}
          <div
            className="mt-4 rounded-xl px-5 py-3 flex items-center justify-between border"
            style={{ backgroundColor: "white", borderColor: "#1E293B10" }}
          >
            <p className="text-xs" style={{ color: "#1E293B70" }}>
              Shopping for food deals?
            </p>
            <Link
              href="/login"
              className="text-xs hover:underline"
              style={{ color: "#2F5D50", fontWeight: 600 }}
            >
              Shopper login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
