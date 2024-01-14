import React from "react";
import { PanelLeftCloseIcon } from "lucide-react";

export default function SidebarContainer({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-[240px] group transition">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold select-none">APADS</div>
          <PanelLeftCloseIcon
            size={24}
            className="hidden group-hover:flex cursor-pointer"
          />
        </div>

        <div role="navigation-items">{children}</div>
      </div>
    </div>
  );
}
