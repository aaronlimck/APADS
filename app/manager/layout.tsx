import React from "react";
import ManagerNavItems from "@/components/navigation/managerNavItems";
import SidebarContainer from "@/components/navigation/sidebarContainer";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarContainer>
        <ManagerNavItems />
      </SidebarContainer>
      <div className="w-full bg-red-100">{children}</div>
    </div>
  );
}
