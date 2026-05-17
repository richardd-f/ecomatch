"use client";

import { useRef, createContext } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

// A simple context just to let items know they are in a stagger container (optional, but good for structure)
export const StaggerContext = createContext(true);

export function StaggerContainer({ children, className = "", stagger = 0.1, delay = 0 }: StaggerContainerProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Select all elements with the 'stagger-item' class inside this container
    gsap.from(".stagger-item", {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: stagger,
      delay: delay,
      ease: "power3.out",
    });
  }, { scope: container });

  return (
    <StaggerContext.Provider value={true}>
      <div ref={container} className={className}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
}
