import React from "react";
import { cn } from "@/lib/utils";

export default function Badge({
  color,
  children,
  className
}: {
  color: string;
  children: React.ReactNode;
  className?: string;
}) {
  const colorClasses: { [key: string]: string } = {
    yellow: "text-yellow-800 bg-yellow-100",
    blue: "text-blue-800 bg-blue-100",
    green: "text-green-800 bg-green-100",
    red: "text-red-800 bg-red-100",
    default: "text-gray-800 bg-gray-100"
  };

  const defaultClassName = "text-gray-800 bg-gray-100";
  const colorClassName = colorClasses[color] || defaultClassName;

  return (
    <span
      className={cn(
        "w-fit text-xs font-medium px-2.5 py-0.5 rounded select-none",
        colorClassName,
        className
      )}
    >
      {children}
    </span>
  );
}
