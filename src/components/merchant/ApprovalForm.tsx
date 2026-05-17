"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { publishProductAction } from "@/features/inventory/actions/publish.actions";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  startPrice: z.number().min(0, "Start price must be positive"),
  endPrice: z.number().min(0, "End price must be positive"),
  tier: z.enum(["TIER_1", "TIER_2"]),
  quantity: z.number().min(1, "Volume must be at least 1"),
  category: z.string().min(1, "Category is required"),
});

type FormData = z.infer<typeof schema>;

interface ApprovalFormProps {
  initialData?: Partial<FormData>;
  imageUrl?: string;
}

export function ApprovalForm({ initialData, imageUrl }: ApprovalFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [merchantLoc, setMerchantLoc] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMerchantLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.log("Location denied", err)
      );
    }
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      startPrice: initialData?.startPrice || 0,
      endPrice: initialData?.endPrice || 0,
      tier: initialData?.tier || "TIER_1",
      quantity: initialData?.quantity || 1,
      category: initialData?.category || "Compost",
    },
  });

  const selectedTier = useWatch({ control, name: "tier" });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // 3 days expiry by default

    const res = await publishProductAction({
      ...data,
      expiresAt: expiresAt.toISOString(),
      imageUrl,
      merchantLat: merchantLoc?.lat,
      merchantLon: merchantLoc?.lon,
    });

    if (res.error) {
      alert(res.error);
      setIsSubmitting(false);
    } else {
      router.push("/merchant");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full max-w-xl mx-auto bg-[#F2EFE7] p-6 md:p-8 rounded-3xl shadow-lg border border-[#A4B69A]/30">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-[#1E293B]">Product Name</label>
        <input
          {...register("title")}
          disabled={isSubmitting}
          className={`w-full p-3.5 rounded-xl border bg-white text-[#1E293B] outline-none transition-all ${
            errors.title ? "border-[#D4A373] ring-1 ring-[#D4A373]" : "border-[#A4B69A] focus:border-[#2F5D50]"
          } disabled:opacity-50`}
        />
        {errors.title && <span className="text-xs text-[#D4A373] font-semibold">{errors.title.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-[#1E293B]">Description</label>
        <textarea
          {...register("description")}
          disabled={isSubmitting}
          rows={4}
          className={`w-full p-3.5 rounded-xl border bg-white text-[#1E293B] outline-none transition-all resize-none ${
            errors.description ? "border-[#D4A373] ring-1 ring-[#D4A373]" : "border-[#A4B69A] focus:border-[#2F5D50]"
          } disabled:opacity-50`}
        />
        {errors.description && <span className="text-xs text-[#D4A373] font-semibold">{errors.description.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#1E293B]">Tier Category</label>
          <select
            {...register("tier")}
            disabled={isSubmitting}
            className={`w-full p-3.5 rounded-xl border bg-white text-[#1E293B] outline-none transition-all ${
              errors.tier ? "border-[#D4A373]" : "border-[#A4B69A] focus:border-[#2F5D50]"
            } disabled:opacity-50`}
          >
            <option value="TIER_1">Tier 1 (Commercial)</option>
            <option value="TIER_2">Tier 2 (Ecological/Free)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#1E293B]">Category</label>
          <select
            {...register("category")}
            disabled={isSubmitting}
            className={`w-full p-3.5 rounded-xl border bg-white text-[#1E293B] outline-none transition-all ${
              errors.category ? "border-[#D4A373]" : "border-[#A4B69A] focus:border-[#2F5D50]"
            } disabled:opacity-50`}
          >
            {selectedTier === "TIER_1" ? (
              <>
                <option value="Bakery">Bakery</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Prepared Meals">Prepared Meals</option>
              </>
            ) : (
              <>
                <option value="Maggot BSF">Maggot BSF</option>
                <option value="Compost">Compost</option>
                <option value="Eco Enzyme">Eco Enzyme</option>
                <option value="Livestock Feed">Livestock Feed</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#1E293B]">Est. Volume (Units/Kg)</label>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            disabled={isSubmitting}
            className={`w-full p-3.5 rounded-xl border bg-white text-[#1E293B] outline-none transition-all ${
              errors.quantity ? "border-[#D4A373] ring-1 ring-[#D4A373]" : "border-[#A4B69A] focus:border-[#2F5D50]"
            } disabled:opacity-50`}
          />
          {errors.quantity && <span className="text-xs text-[#D4A373] font-semibold">{errors.quantity.message}</span>}
        </div>

        {selectedTier === "TIER_1" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#1E293B]">Discounted Price (IDR)</label>
            <input
              type="number"
              {...register("endPrice", { valueAsNumber: true })}
              disabled={isSubmitting}
              className={`w-full p-3.5 rounded-xl border bg-white text-[#1E293B] outline-none transition-all ${
                errors.endPrice ? "border-[#D4A373] ring-1 ring-[#D4A373]" : "border-[#A4B69A] focus:border-[#2F5D50]"
              } disabled:opacity-50`}
            />
            {errors.endPrice && <span className="text-xs text-[#D4A373] font-semibold">{errors.endPrice.message}</span>}
          </div>
        )}
      </div>

      {selectedTier === "TIER_2" && (
        <div className="p-3 bg-[#A4B69A]/20 rounded-xl border border-[#A4B69A]/30">
          <p className="text-xs text-[#1E293B] font-medium leading-relaxed">
            Note: Ecological items are listed as FREE to encourage sustainable waste distribution. Price inputs are disabled.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full py-4 rounded-xl bg-[#2F5D50] text-white font-bold text-lg transition-colors hover:bg-[#A4B69A] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-[#2F5D50]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Publishing...
          </>
        ) : (
          "Publish"
        )}
      </button>
    </form>
  );
}
