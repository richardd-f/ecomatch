"use client";

import { useState } from "react";
import { registerMerchantAction } from "../actions/auth.actions";
import { MerchantRegisterFormData } from "../interfaces/auth.interface";

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
      {error && <div className="text-sm p-3 bg-[#D4A373]/10 text-[#D4A373] font-medium rounded-xl border border-[#D4A373]/20 flex items-center justify-center">{error}</div>}
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-[#1E293B]">Business Name</label>
        <input
          type="text"
          required
          className="px-4 py-3 bg-[#F2EFE7]/50 border border-[#1E293B]/10 rounded-xl outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 text-[#1E293B] font-medium"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-[#1E293B]">Work Email Address</label>
        <input
          type="email"
          required
          className="px-4 py-3 bg-[#F2EFE7]/50 border border-[#1E293B]/10 rounded-xl outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 text-[#1E293B] font-medium"
          value={formData.workEmail}
          onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
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

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-[#1E293B]">Invite Code</label>
        <input
          type="text"
          required
          className="px-4 py-3 bg-[#F2EFE7]/50 border border-[#1E293B]/10 rounded-xl outline-none focus:border-[#2F5D50] focus:ring-2 focus:ring-[#2F5D50]/20 text-[#1E293B] font-medium"
          value={formData.inviteCode}
          onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full py-3.5 rounded-xl text-white font-bold bg-[#2F5D50] hover:bg-[#A4B69A] disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
      >
        {isLoading ? "Creating merchant account..." : "Complete Registration"}
      </button>
    </form>
  );
}
