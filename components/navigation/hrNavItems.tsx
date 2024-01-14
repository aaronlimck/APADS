import { FileIcon, HomeIcon, WorkflowIcon } from "lucide-react";
import NavItem from "./navItem";

export default function HRNavItems() {
  return (
    <div className="space-y-1">
      <NavItem href="/hr" icon={<HomeIcon size={20} />}>
        Home
      </NavItem>
      <NavItem href="/hr/templates" icon={<FileIcon size={20} />}>
        Templates
      </NavItem>
      <NavItem href="/hr/workflows" icon={<WorkflowIcon size={20} />}>
        Workflows
      </NavItem>
    </div>
  );
}
