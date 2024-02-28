import { CreateAutomationBtn } from "@/components/automation/createAutomation";
import HRNavItems from "@/components/navigation/hrNavItems";
import dynamic from "next/dynamic";
import React from "react";

const SidebarWithNoSSR = dynamic(
  () => import("@/components/navigation/sidebar"),
  { ssr: false }
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

      <div className="w-full">
        <div className="border-b border-gray-200 space-y-4 py-6 px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Automation</h1>
            <CreateAutomationBtn />
          </div>
        </div>

        <div className="w-full min-h-[calc(100dvh-89px)] bg-gray-50 px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
