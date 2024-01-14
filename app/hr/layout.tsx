import React from "react";
import HRNavItems from "@/components/navigation/hrNavItems";
import SidebarContainer from "@/components/navigation/sidebarContainer";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarContainer>
        <HRNavItems />
      </SidebarContainer>
      <div className="w-full bg-red-100">{children}</div>
    </div>
  );
}
