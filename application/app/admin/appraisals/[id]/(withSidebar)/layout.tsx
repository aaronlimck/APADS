import HRNavItems from "@/components/navigation/hrNavItems";
import dynamic from "next/dynamic";
import React from "react";

const SidebarWithNoSSR = dynamic(
  () => import("@/components/navigation/sidebar"),
  { ssr: false }
);

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarWithNoSSR classname="hidden md:flex">
        <HRNavItems />
      </SidebarWithNoSSR>

      <div className="w-full px-4 py-6">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </div>
    </div>
  );
}
