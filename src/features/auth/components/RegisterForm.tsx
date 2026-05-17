"use client";

import { useState } from "react";
import { registerConsumerAction } from "../actions/auth.actions";
import { RegisterFormData } from "../interfaces/auth.interface";

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await registerConsumerAction(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      // successful login/registration redirects handled by the proxy or window location
      window.location.href = "/";
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-sm p-3 bg-[#D4A373]/10 text-[#D4A373] font-medium rounded-xl border border-[#D4A373]/20 flex items-center justify-center">{error}</div>}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-[#1E293B]">Full Name</label>
        <input
          type="text"
          required
          className="px-4 py-3 bg-[#F2EFE7]/50 border border-[#1E293B]/10 rounded-xl outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 text-[#1E293B] font-medium"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

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
        <label className="text-sm font-bold text-[#1E293B]">Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="px-4 py-3 bg-[#F2EFE7]/50 border border-[#1E293B]/10 rounded-xl outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 text-[#1E293B] font-medium"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-[#1E293B]">Confirm Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="px-4 py-3 bg-[#F2EFE7]/50 border border-[#1E293B]/10 rounded-xl outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 text-[#1E293B] font-medium"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full py-3.5 rounded-xl text-white font-bold bg-[#2F5D50] hover:bg-[#A4B69A] disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
