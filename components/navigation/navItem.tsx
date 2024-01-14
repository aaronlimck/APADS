"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({
  href,
  children,
  icon
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <Link
      href={href}
      className={`flex flex-row items-center text-sm p-2 space-x-2 rounded-md ${
        href === pathname
          ? "bg-green-100 text-gray-900"
          : "text-gray-800 hover:bg-gray-100"
      }}`}
    >
      {icon}
      <div>{children}</div>
    </Link>
  );
}
