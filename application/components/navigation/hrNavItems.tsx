"use client";
import { FileIcon, LogOutIcon, UserIcon, WorkflowIcon } from "lucide-react";
import { SidebarButton, SidebarItem } from "./sidebar";
import { signOut } from "next-auth/react";

export default function HRNavItems() {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-1">
        <SidebarItem
          icon={<UserIcon size={20} />}
          href="/admin/employees"
          text="Employees"
        />
        <SidebarItem
          icon={<FileIcon size={20} />}
          href="/admin/appraisals"
          text="Appraisals"
        />
        <SidebarItem
          icon={<WorkflowIcon size={20} />}
          href="/admin/automation"
          text="Automation"
        />
      </div>
      <div className="pb-4">
        <SidebarButton
          icon={<LogOutIcon size={20} />}
          text="Log Out"
          onClick={() => signOut()}
        />
      </div>
    </div>
  );
}
