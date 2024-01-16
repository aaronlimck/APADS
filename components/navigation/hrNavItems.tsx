import {
  FileIcon,
  HomeIcon,
  SettingsIcon,
  UserIcon,
  WorkflowIcon
} from "lucide-react";
import { SidebarItem } from "./sidebar";

export default function HRNavItems() {
  return (
    <div className="space-y-1">
      <SidebarItem icon={<HomeIcon size={20} />} href="/hr" text="Home" />
      <SidebarItem
        icon={<UserIcon size={20} />}
        href="/hr/directory"
        text="Directory"
      />
      <SidebarItem
        icon={<FileIcon size={20} />}
        href="/hr/templates"
        text="Templates"
      />
      <SidebarItem
        icon={<WorkflowIcon size={20} />}
        href="/hr/workflows"
        text="Workflows"
      />
      <SidebarItem icon={<SettingsIcon size={20} />} href="#" text="Settings" />
    </div>
  );
}
