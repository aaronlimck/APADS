import HRNavItems from "@/components/navigation/hrNavItems";
import dynamic from "next/dynamic";
import React from "react";

const SidebarWithNoSSR = dynamic(
  () => import("@/components/navigation/sidebar"),
  { ssr: false },
);
export default function AdminMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarWithNoSSR classname="hidden md:flex">
        <HRNavItems />
      </SidebarWithNoSSR>

      <div className="mx-auto min-h-[calc(100dvh-89px)] w-full max-w-7xl px-4 py-6">
        {children}
      </div>
    </div>
  );
}
