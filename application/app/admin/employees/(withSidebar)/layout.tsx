import NewEmployeeModal from "@/components/modal/new-employee-modal";
import HRNavItems from "@/components/navigation/hrNavItems";
import { Button } from "@/components/ui/button";
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

      <div className="w-full">
        <div className="space-y-4 border-b border-gray-200 px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Employees</h1>
            <NewEmployeeModal action={<Button>New Employee</Button>} />
          </div>
        </div>

        <div className="min-h-[calc(100dvh-89px)] w-full bg-gray-50 px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
