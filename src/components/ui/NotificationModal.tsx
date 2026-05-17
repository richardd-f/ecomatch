"use client";

import { useState, useEffect } from "react";
import { subscribeToNotificationsAction } from "@/features/notifications/actions/notification.actions";
import { PushSubscriptionObj } from "@/interfaces/notification.types";
import { BellRing, Loader2 } from "lucide-react";

export function NotificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't made a choice, or if we want to prompt.
    // For simplicity, we check if notification permission is default.
    if ("Notification" in window && Notification.permission === "default") {
      setTimeout(() => setIsOpen(true), 0);
    }
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const registration = await navigator.serviceWorker.register("/sw.js");
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U",
        });

        // Try to get location
        let lat, lon;
        if ("geolocation" in navigator) {
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
          } catch (err) {
            console.log("Location access denied or failed", err);
          }
        }

        const subObj: PushSubscriptionObj = JSON.parse(JSON.stringify(subscription));
        await subscribeToNotificationsAction(subObj, lat, lon);
        
        // Show local success
        registration.showNotification("Notifications Enabled!", {
          body: "You'll now receive alerts for nearby organic waste.",
          icon: "/images/logo/logo.png",
        });
      }
    } catch (error) {
      console.error("Subscription failed", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 bg-[#1E293B]/20 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#F2EFE7] rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <BellRing className="w-32 h-32 text-[#2F5D50]" />
        </div>
        
        <div className="w-16 h-16 bg-[#A4B69A]/20 rounded-full flex items-center justify-center mb-6 relative z-10">
          <BellRing className="w-8 h-8 text-[#2F5D50]" />
        </div>
        
        <h2 className="text-xl font-bold text-[#1E293B] mb-3 relative z-10">Enable Local Alerts</h2>
        <p className="text-[#1E293B]/80 text-sm mb-8 leading-relaxed relative z-10">
          Get instantly notified when verified organic waste is published near you. Never miss a free listing!
        </p>
        
        <div className="flex flex-col gap-3 w-full relative z-10">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#2F5D50] text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enable Notifications"}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-transparent border border-[#A4B69A] text-[#1E293B] font-semibold text-sm hover:bg-[#A4B69A]/10 transition-all"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
