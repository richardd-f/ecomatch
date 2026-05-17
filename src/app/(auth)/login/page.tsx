import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-12 bg-[#F2EFE7] min-h-screen">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative w-28 h-28">
            <Image 
              src="/images/logo/Logo_Ecomatch_Baru-removebg-preview.png" 
              alt="EcoMatch Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center mt-[-10px]">
            <h1
              className="text-2xl"
              style={{ color: "#1E293B", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Welcome back to <span style={{ color: "#2F5D50" }}>EcoMatch</span>
            </h1>
            <p className="text-sm font-medium mt-1" style={{ color: "#1E293B80" }}>
              Sign in to rescue premium surplus
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-sm border"
          style={{ backgroundColor: "white", borderColor: "#1E293B15" }}
        >
          <LoginForm />

          <p className="text-sm text-center mt-6" style={{ color: "#1E293B70" }}>
            New to EcoMatch?{" "}
            <Link
              href="/register"
              style={{ color: "#2F5D50", fontWeight: 600 }}
              className="hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
