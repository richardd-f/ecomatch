import Link from "next/link";
import Image from "next/image";
import { Store, Leaf, Zap, CheckCircle2 } from "lucide-react";
import { MerchantRegisterForm } from "@/features/auth/components/MerchantRegisterForm";

const ONBOARDING_STEPS = [
  { step: "01", label: "Register with your invite code", done: false, active: true },
  { step: "02", label: "List your first surplus product", done: false, active: false },
  { step: "03", label: "Gemini AI sets the optimal price", done: false, active: false },
  { step: "04", label: "Buyers claim. You earn. Waste drops.", done: false, active: false },
];

export default function MerchantRegisterPage() {
  return (
    <div
      className="flex-grow flex"
      style={{ backgroundColor: "#F2EFE7" }}
    >
      {/* Left panel */}
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
              Start rescuing food.
              <br />
              <span style={{ color: "#D4A373" }}>Go live in minutes.</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              During Hackfest, merchant onboarding is instant. Enter your invite code, add your
              first listing, and let our Gemini AI handle pricing. No manual review. No waiting.
            </p>
          </div>

          {/* Onboarding steps */}
          <div className="flex flex-col gap-0">
            {ONBOARDING_STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{
                      backgroundColor: i === 0 ? "#2F5D50" : "rgba(255,255,255,0.1)",
                      color: i === 0 ? "white" : "rgba(255,255,255,0.4)",
                      fontWeight: 700,
                    }}
                  >
                    {s.step}
                  </div>
                  {i < ONBOARDING_STEPS.length - 1 && (
                    <div
                      className="w-px flex-1 my-1"
                      style={{ backgroundColor: "rgba(255,255,255,0.1)", minHeight: "20px" }}
                    />
                  )}
                </div>
                <div className="pb-4">
                  <p
                    className="text-sm"
                    style={{
                      color: i === 0 ? "white" : "rgba(255,255,255,0.45)",
                      fontWeight: i === 0 ? 600 : 400,
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Hackfest badge */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: "rgba(212,163,115,0.15)", border: "1px solid rgba(212,163,115,0.3)" }}
          >
            <Zap className="w-5 h-5 flex-shrink-0" style={{ color: "#D4A373" }} />
            <div>
              <p className="text-xs mt-0.5" style={{ color: "rgba(212,163,115,0.7)" }}>
                Your invite code skips the 2–3 day manual verification process.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
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
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                style={{ backgroundColor: "#1E293B", color: "white", fontWeight: 600 }}
              >
                <Store className="w-3 h-3" />
                Merchant Account
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                style={{ backgroundColor: "#D4A37320", color: "#D4A373", fontWeight: 600 }}
              >
                <Zap className="w-3 h-3" />
                
              </span>
            </div>

            <div className="mb-6">
              <h2
                className="text-xl"
                style={{ color: "#1E293B", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                Create your merchant account
              </h2>
              <p className="text-sm mt-1" style={{ color: "#1E293B60" }}>
                Use your Hackfest invite code to skip verification and go live instantly.
              </p>
            </div>

            <MerchantRegisterForm />

            <div
              className="mt-5 pt-5 border-t"
              style={{ borderColor: "#1E293B08" }}
            >
              <p className="text-sm" style={{ color: "#1E293B60" }}>
                Already have a merchant account?{" "}
                <Link
                  href="/merchantLogin"
                  style={{ color: "#2F5D50", fontWeight: 600 }}
                  className="hover:underline"
                >
                  Access Dashboard →
                </Link>
              </p>
            </div>
          </div>

          {/* What you get */}
          <div
            className="mt-4 rounded-xl p-4 border"
            style={{ backgroundColor: "white", borderColor: "#1E293B10" }}
          >
            <p className="text-xs mb-3" style={{ color: "#1E293B", fontWeight: 700 }}>
              What you get as an EcoMatch Merchant
            </p>
            <div className="flex flex-col gap-2">
              {[
                "AI-powered dynamic pricing via Gemini Vision",
                "Direct access to local eco-conscious buyers",
                "Real-time sales dashboard & impact metrics",
                "Zero listing fees during Hackfest period",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#2F5D50" }} />
                  <span className="text-xs" style={{ color: "#1E293B70" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Consumer cross-link */}
          <div
            className="mt-3 rounded-xl px-5 py-3 flex items-center justify-between border"
            style={{ backgroundColor: "white", borderColor: "#1E293B10" }}
          >
            <p className="text-xs" style={{ color: "#1E293B70" }}>
              Just shopping for food deals?
            </p>
            <Link
              href="/register"
              className="text-xs hover:underline"
              style={{ color: "#2F5D50", fontWeight: 600 }}
            >
              Shopper signup →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
