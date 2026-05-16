import { Leaf, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#F2EFE7" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
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
              Welcome back to <span style={{ color: "#2F5D50" }}>EcoMatch</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#1E293B70" }}>
              Sign in to claim food deals
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
