import Navbar from "@/components/navigation/navbar";
import StaffNavItems from "@/components/navigation/staffNavItems";
import dynamic from "next/dynamic";
import React from "react";

const SidebarWithNoSSR = dynamic(
  () => import("@/components/navigation/sidebar"),
  { ssr: false }
);

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarWithNoSSR>
        <StaffNavItems />
      </SidebarWithNoSSR>
      <div className="w-full">
        <Navbar />
        <div className="max-w-6xl mx-auto w-full">{children}</div>
      </div>
    </div>
  );
}
