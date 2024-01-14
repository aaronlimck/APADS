import { HomeIcon } from "lucide-react";
import NavItem from "./navItem";

export default function ManagerNavItems() {
  return (
    <div className="space-y-1">
      <NavItem href="/manager" icon={<HomeIcon size={20} />}>
        Home
      </NavItem>
    </div>
  );
}
