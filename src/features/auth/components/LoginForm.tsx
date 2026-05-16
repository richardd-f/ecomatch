"use client";

import { useState } from "react";
import { loginAction } from "../actions/auth.actions";
import { LoginFormData } from "../type";

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
      {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Email Address</label>
        <input
          type="email"
          required
          className="px-3 py-2 border rounded-lg outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <a href="#" className="text-xs text-[#2F5D50] hover:underline font-medium">Forgot password?</a>
        </div>
        <input
          type="password"
          required
          className="px-3 py-2 border rounded-lg outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full py-2.5 rounded-lg text-white font-medium bg-[#2F5D50] hover:bg-[#2F5D50]/90 disabled:opacity-50 transition-colors"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
