"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  duration?: number;
  delay?: number;
}

export function FloatingElement({ 
  children, 
  className = "", 
  yOffset = -10, 
  duration = 2,
  delay = 0
}: FloatingElementProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(container.current, {
      y: yOffset,
      duration,
      delay,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, { scope: container });

  return (
    <div ref={container} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}
