import { HomeIcon } from "lucide-react";
import { SidebarItem } from "./sidebar";

export default function StaffNavItems() {
  return (
    <div className="space-y-1">
      <SidebarItem icon={<HomeIcon size={20} />} href="/staff" text="Home" />
    </div>
  );
}
