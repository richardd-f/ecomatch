"use client";

import { ReactNode } from "react";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <div className={`stagger-item ${className}`}>
      {children}
    </div>
  );
}
