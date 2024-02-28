import React from "react";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen">{children}</div>;
}
