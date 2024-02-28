import NavBar from "@/components/navigation/navbar";
import React from "react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <NavBar />
      {children}
    </div>
  );
}
