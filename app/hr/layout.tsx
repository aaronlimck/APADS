import React from "react";
import HRNavItems from "@/components/navigation/hrNavItems";
import SidebarContainer from "@/components/navigation/sidebar";
import Navbar from "@/components/navigation/navbar";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarContainer classname="hidden md:flex">
        <HRNavItems />
      </SidebarContainer>
      <div className="w-full">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
