"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  expiresAt: string | Date;
  className?: string;
}

export function CountdownTimer({ expiresAt, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const targetDate = new Date(expiresAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!timeLeft) {
    return (
      <div className={`flex items-center gap-1 text-[10px] font-medium text-[#1E293B]/40 ${className}`}>
        <Clock className="w-3 h-3" />
        <span>--:--:--</span>
      </div>
    );
  }

  const isExpired = timeLeft === "Expired";
  const isEndingSoon = !isExpired && timeLeft.startsWith("00:"); // Less than 1 hour

  return (
    <div
      className={`flex items-center gap-1 text-[10px] font-bold ${
        isExpired
          ? "text-red-500"
          : isEndingSoon
          ? "text-[#D4A373]"
          : "text-[#2F5D50]"
      } ${className}`}
    >
      <Clock className="w-3 h-3" />
      <span>{timeLeft}</span>
    </div>
  );
}
