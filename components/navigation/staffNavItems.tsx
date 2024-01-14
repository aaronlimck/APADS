import { HomeIcon } from "lucide-react";
import NavItem from "./navItem";

export default function StaffNavItems() {
  return (
    <div className="space-y-1">
      <NavItem href="/staff" icon={<HomeIcon size={20} />}>
        Home
      </NavItem>
    </div>
  );
}
