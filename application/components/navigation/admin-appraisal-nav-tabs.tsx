"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminAppraisalNavTabs() {
  const pathname = usePathname();

  return (
    <div className="text-sm font-medium text-center text-gray-500">
      <ul className="flex flex-wrap -mb-px">
        <li className="me-2">
          <Link
            href="/admin/appraisals"
            className={cn(
              "inline-block px-4 py-2.5 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300",
              pathname === "/admin/appraisals" &&
                "text-indigo-800 border-b-2 border-indigo-600"
            )}
          >
            All
          </Link>
        </li>
        <li className="me-2">
          <Link
            href="/admin/appraisals/templates"
            className={cn(
              "inline-block px-4 py-2.5 border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300",
              pathname === "/admin/appraisals/templates" &&
                "text-indigo-800 border-b-2 border-indigo-600"
            )}
          >
            Templates
          </Link>
        </li>
      </ul>
    </div>
  );
}
