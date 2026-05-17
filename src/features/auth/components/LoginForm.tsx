"use client";

import { useState } from "react";
import { loginAction } from "../actions/auth.actions";
import { LoginFormData } from "../interfaces/auth.interface";

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-sm p-3 bg-[#D4A373]/10 text-[#D4A373] font-medium rounded-xl border border-[#D4A373]/20 flex items-center justify-center">{error}</div>}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-[#1E293B]">Email Address</label>
        <input
          type="email"
          required
          className="px-4 py-3 bg-[#F2EFE7]/50 border border-[#1E293B]/10 rounded-xl outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 text-[#1E293B] font-medium"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-[#1E293B]">Password</label>
          <a href="#" className="text-xs text-[#2F5D50] hover:text-[#A4B69A] transition-colors font-semibold">Forgot password?</a>
        </div>
        <input
          type="password"
          required
          className="px-4 py-3 bg-[#F2EFE7]/50 border border-[#1E293B]/10 rounded-xl outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 text-[#1E293B] font-medium"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full py-3.5 rounded-xl text-white font-bold bg-[#2F5D50] hover:bg-[#A4B69A] disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
