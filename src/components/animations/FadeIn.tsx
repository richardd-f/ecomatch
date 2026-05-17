"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.6, y = 30, className = "" }: FadeInProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(container.current, {
      y,
      opacity: 0,
      duration,
      delay,
      ease: "power3.out",
    });
  }, { scope: container });

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  );
}
