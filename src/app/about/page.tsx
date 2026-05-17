import { Leaf, Zap, Users, Globe, Recycle, TrendingDown, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";

export const metadata = {
  title: "About | EcoMatch",
  description:
    "Learn how EcoMatch uses AI to bridge the gap between surplus food and communities that need it.",
};

const STATS = [
  { value: "14.73M", unit: " ton/yr", label: "Food waste in Indonesia", source: "UNEP, 2024" },
  { value: "41.4%", unit: "", label: "Of all national waste is food", source: "KLHK, 2023" },
  { value: "Rp 551T", unit: " /yr", label: "Economic loss from food waste", source: "Bappenas, 2021" },
  { value: "7.29%", unit: "", label: "GHG emissions from food waste", source: "Bappenas, 2021" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Zap,
    title: "Merchant Snaps a Photo",
    description:
      "A restaurant or food stall photographs their unsold surplus. No manual typing needed — our AI takes it from there.",
  },
  {
    step: "02",
    icon: Leaf,
    title: "Gemini Vision AI Classifies",
    description:
      "Google Gemini Flash Vision analyzes the image and generates a full listing: name, description, ecological classification, estimated volume, and dynamic pricing — all in seconds.",
  },
  {
    step: "03",
    icon: Users,
    title: "Buyers Discover & Claim",
    description:
      "Consumers see discounted Tier 1 listings. Urban farmers and maggot BSF cultivators see free Tier 2 organic waste. All sorted by Haversine-based proximity.",
  },
  {
    step: "04",
    icon: Recycle,
    title: "Verified Pickup via QR",
    description:
      "Each claim generates a unique QR code. Merchants scan it at pickup as proof of handoff. Waste diverted. Mission accomplished.",
  },
];

const TECH = [
  { name: "Next.js 16", desc: "App Router + Server Actions" },
  { name: "Gemini Flash Vision", desc: "AI image classification" },
  { name: "Cloudinary", desc: "Image pipeline & CDN" },
  { name: "PostgreSQL + Prisma", desc: "Typed ORM + relational DB" },
  { name: "Midtrans", desc: "Indonesian payment gateway" },
  { name: "Haversine Formula", desc: "Client-side geo-sorting" },
  { name: "Docker + Nginx", desc: "Containerised deployment" },
  { name: "NextAuth v5", desc: "JWT session management" },
];

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col gap-0">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1E293B] px-6 py-20 md:px-16 md:py-28">
        {/* decorative blobs */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #2F5D50, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #D4A373, transparent 70%)" }}
        />

        <FadeIn delay={0.1} className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2F5D50] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#A4B69A]">
              About EcoMatch
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            Bridging the gap between{" "}
            <span className="text-[#A4B69A]">surplus food</span> and{" "}
            <span className="text-[#D4A373]">community need</span>.
          </h1>

          <p className="text-base md:text-lg text-white/60 max-w-2xl leading-relaxed">
            Indonesia discards 14.73 million tons of food every year while 22 million people face
            food insecurity. EcoMatch uses Vision AI to make redistribution effortless, instant, and
            verifiable.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2F5D50] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Explore Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/merchantRegister"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Join as Merchant
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── Stats ── */}
      <section className="bg-[#F2EFE7] px-6 py-14 md:px-16">
        <FadeIn delay={0.1}>
          <p className="text-xs font-bold tracking-widest uppercase text-[#2F5D50] mb-8 text-center">
            The problem we're solving
          </p>
        </FadeIn>
        <StaggerContainer
          delay={0.2}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {STATS.map((s) => (
            <StaggerItem key={s.label}>
              <div className="bg-white rounded-2xl p-6 border border-[#1E293B]/8 shadow-sm flex flex-col gap-1 h-full">
                <p
                  className="text-3xl md:text-4xl font-extrabold text-[#1E293B]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {s.value}
                  <span className="text-lg text-[#D4A373]">{s.unit}</span>
                </p>
                <p className="text-sm text-[#1E293B]/70 font-medium leading-snug">{s.label}</p>
                <p className="text-[10px] text-[#1E293B]/40 mt-auto pt-2">{s.source}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* How it works */}
      <section className="bg-white px-6 py-16 md:px-16">
        <FadeIn delay={0.1} className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-3 mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-[#2F5D50]">
              How it works
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-[#1E293B]"
              style={{ letterSpacing: "-0.02em" }}
            >
              Zero friction from photo to pickup
            </h2>
          </div>
        </FadeIn>

        <StaggerContainer
          delay={0.2}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
            <StaggerItem key={step}>
              <div className="flex gap-5 p-6 rounded-2xl border border-[#1E293B]/8 bg-[#F2EFE7]/50 h-full">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-[#2F5D50] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className="text-xs font-black text-[#1E293B]/20"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {step}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[#1E293B] mb-2">{title}</h3>
                  <p className="text-sm text-[#1E293B]/60 leading-relaxed">{description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Two-tier model */}
      <section className="bg-[#1E293B] px-6 py-16 md:px-16">
        <FadeIn delay={0.1} className="max-w-5xl mx-auto flex flex-col gap-3 mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-[#A4B69A]">
            Our dual-tier model
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            One platform, two impact paths
          </h2>
        </FadeIn>

        <StaggerContainer
          delay={0.2}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {/* Tier 1 */}
          <StaggerItem>
            <div className="rounded-2xl p-8 border border-[#D4A373]/30 bg-[#D4A373]/10 flex flex-col gap-4 h-full">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A373]/20 text-[#D4A373] text-xs font-bold w-fit">
                Tier 1 — Discounted Food
              </span>
              <h3 className="text-xl font-extrabold text-white">For conscious consumers</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Surplus food that is still perfectly safe to eat — baked goods, prepared meals,
                fresh produce — listed at deep discounts. AI sets a dynamic price based on condition
                and time remaining. Checkout via QRIS, GoPay, or OVO.
              </p>
              <div className="mt-auto pt-4 border-t border-white/10 text-xs text-white/40">
                Countdown timer · Midtrans checkout · QR pickup verification
              </div>
            </div>
          </StaggerItem>

          {/* Tier 2 */}
          <StaggerItem>
            <div className="rounded-2xl p-8 border border-[#A4B69A]/30 bg-[#A4B69A]/10 flex flex-col gap-4 h-full">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A4B69A]/20 text-[#A4B69A] text-xs font-bold w-fit">
                Tier 2 — Free Organic Waste
              </span>
              <h3 className="text-xl font-extrabold text-white">For urban farmers & eco-communities</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Organic waste — vegetable trimmings, fruit peels, coffee grounds — classified by
                AI for its ideal downstream use: compost, maggot BSF feed, or eco-enzyme. Claimable
                for free with a unique QR handoff token.
              </p>
              <div className="mt-auto pt-4 border-t border-white/10 text-xs text-white/40">
                AI ecological routing · Bulk-claim UI · Zero cost
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Tech stack */}
      <section className="bg-[#F2EFE7] px-6 py-16 md:px-16">
        <FadeIn delay={0.1} className="max-w-5xl mx-auto flex flex-col gap-3 mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-[#2F5D50]">
            Tech stack
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-[#1E293B]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Built lean. Built to scale.
          </h2>
          <p className="text-sm text-[#1E293B]/60 max-w-xl">
            Every technology was chosen to maximise development velocity within a 24-hour hackathon
            constraint without sacrificing reliability during a live demo.
          </p>
        </FadeIn>

        <StaggerContainer
          delay={0.2}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-5xl mx-auto"
        >
          {TECH.map((t) => (
            <StaggerItem key={t.name}>
              <div className="bg-white rounded-xl px-4 py-4 border border-[#1E293B]/8 shadow-sm flex flex-col gap-1">
                <p className="text-sm font-bold text-[#2F5D50]">{t.name}</p>
                <p className="text-xs text-[#1E293B]/50">{t.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── SDG alignment ── */}
      <section className="bg-white px-6 py-16 md:px-16">
        <FadeIn delay={0.1} className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col gap-3 md:w-1/2">
              <p className="text-xs font-bold tracking-widest uppercase text-[#2F5D50]">
                Impact & alignment
              </p>
              <h2
                className="text-3xl font-extrabold text-[#1E293B]"
                style={{ letterSpacing: "-0.02em" }}
              >
                Every kilogram diverted matters
              </h2>
              <p className="text-sm text-[#1E293B]/60 leading-relaxed">
                Each ton of organic waste redirected from landfill saves approximately{" "}
                <strong>0.58 ton CO₂e</strong> in methane emissions (U.S. EPA WARM model). At 30–50
                active merchants uploading daily, EcoMatch projects{" "}
                <strong>±212 ton CO₂e saved per year</strong> at early scale.
              </p>
            </div>

            <div className="md:w-1/2 grid grid-cols-2 gap-3">
              {[
                {
                  icon: Globe,
                  sdg: "SDG 12",
                  title: "Responsible Consumption",
                  color: "#D4A373",
                },
                {
                  icon: TrendingDown,
                  sdg: "SDG 13",
                  title: "Climate Action",
                  color: "#2F5D50",
                },
                {
                  icon: Users,
                  sdg: "SDG 2",
                  title: "Zero Hunger",
                  color: "#A4B69A",
                },
                {
                  icon: ShieldCheck,
                  sdg: "SDG 11",
                  title: "Sustainable Cities",
                  color: "#1E293B",
                },
              ].map(({ icon: Icon, sdg, title, color }) => (
                <div
                  key={sdg}
                  className="rounded-xl p-4 border border-[#1E293B]/8 bg-[#F2EFE7]/50 flex flex-col gap-2"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color }}>
                    {sdg}
                  </p>
                  <p className="text-xs font-semibold text-[#1E293B]">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="bg-[#2F5D50] px-6 py-16 md:px-16 text-center">
        <FadeIn delay={0.1} className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Ready to rescue food?
          </h2>
          <p className="text-white/70 text-sm md:text-base max-w-md">
            Join hundreds of merchants and buyers already using EcoMatch to fight food waste —
            one listing at a time.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#2F5D50] text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Browse Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/merchantRegister"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white text-sm font-bold hover:bg-white/10 transition-colors"
            >
              List Your Surplus
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}