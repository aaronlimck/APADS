import React from "react";
import SidebarContainer from "@/components/navigation/sidebar";
import StaffNavItems from "@/components/navigation/staffNavItems";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarContainer>
        <StaffNavItems />
      </SidebarContainer>
      <div className="w-full bg-red-100">{children}</div>
    </div>
  );
}
