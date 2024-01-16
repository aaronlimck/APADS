import { HomeIcon } from "lucide-react";
import { SidebarItem } from "./sidebar";

export default function ManagerNavItems() {
  return (
    <div className="space-y-1">
      <SidebarItem icon={<HomeIcon size={20} />} href="/manager" text="Home" />
    </div>
  );
}
