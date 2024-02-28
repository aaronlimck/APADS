import AdminAppraisalNavTabs from "@/components/navigation/admin-appraisal-nav-tabs";
import HRNavItems from "@/components/navigation/hrNavItems";
import { buttonVariants } from "@/components/ui/button";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";

const SidebarWithNoSSR = dynamic(
  () => import("@/components/navigation/sidebar"),
  { ssr: false },
);

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarWithNoSSR classname="hidden md:flex">
        <HRNavItems />
      </SidebarWithNoSSR>

      <div className="w-full">
        <div className="space-y-4 border-b border-gray-200 px-4 pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Appraisals</h1>
            <Link
              href="/admin/appraisals/create"
              className={buttonVariants({ variant: "default" })}
            >
              New Appraisal
            </Link>
          </div>
          <AdminAppraisalNavTabs />
        </div>

        <div className="min-h-[calc(100dvh-122px)] w-full bg-gray-50 px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
