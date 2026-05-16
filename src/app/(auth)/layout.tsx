import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-grow flex flex-col min-h-0 overflow-auto">
      {children}
    </div>
  );
}
