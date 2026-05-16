"use client";

import { useState } from "react";
import { registerMerchantAction } from "../actions/auth.actions";
import { MerchantRegisterFormData } from "../type";

export function MerchantRegisterForm() {
  const [formData, setFormData] = useState<MerchantRegisterFormData>({
    businessName: "",
    workEmail: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
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

    const result = await registerMerchantAction(formData);

    if (result?.error) {
      if (result.error === "invalid_invite") {
        setError("Invalid invite code. Use HACKFEST2026 to demo the app.");
      } else {
        setError(result.error);
      }
    } else {
      window.location.href = "/merchant";
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Business Name</label>
        <input
          type="text"
          required
          className="px-3 py-2 border rounded-lg outline-none focus:border-[#1E293B] focus:ring-1 focus:ring-[#1E293B]"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Work Email Address</label>
        <input
          type="email"
          required
          className="px-3 py-2 border rounded-lg outline-none focus:border-[#1E293B] focus:ring-1 focus:ring-[#1E293B]"
          value={formData.workEmail}
          onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="px-3 py-2 border rounded-lg outline-none focus:border-[#1E293B] focus:ring-1 focus:ring-[#1E293B]"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Confirm Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="px-3 py-2 border rounded-lg outline-none focus:border-[#1E293B] focus:ring-1 focus:ring-[#1E293B]"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Invite Code</label>
        <input
          type="text"
          required
          className="px-3 py-2 border rounded-lg outline-none focus:border-[#1E293B] focus:ring-1 focus:ring-[#1E293B]"
          value={formData.inviteCode}
          onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full py-2.5 rounded-lg text-white font-medium bg-[#1E293B] hover:bg-[#1E293B]/90 disabled:opacity-50 transition-colors"
      >
        {isLoading ? "Creating merchant account..." : "Complete Registration"}
      </button>
    </form>
  );
}
