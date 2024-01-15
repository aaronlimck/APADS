"use client";
import { PanelLeftCloseIcon, PanelRightCloseIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { createContext, useEffect } from "react";

// Define the type for your context value
type SidebarContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

// Use createContext with the defined type
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Custom hook to simplify useContext usage
export const useSidebarContext = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext must be used within a SidebarContext.Provider"
    );
  }
  return context;
};

export default function SidebarContainer({
  classname,
  children
}: {
  classname?: string;
  children: React.ReactNode;
}) {
  const storedExpanded = localStorage.getItem("sidebarExpanded");
  const initialExpanded = storedExpanded ? JSON.parse(storedExpanded) : false;
  const [expanded, setExpanded] = React.useState<boolean>(
    initialExpanded || false
  );

  // Save to localStorage whenever 'expanded' changes
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", JSON.stringify(expanded));
  }, [expanded]);

  return (
    <aside className={`sticky top-0 h-screen ${classname}`}>
      <div className="h-full max-w-[240px] flex flex-col bg-[#f7f7f8] shadow-sm">
        <div className="p-4 pb-3 flex items-center justify-between">
          <div
            className={`text-lg font-semibold select-none overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            } `}
          >
            APADS
          </div>
          <button
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? (
              <PanelLeftCloseIcon size={20} />
            ) : (
              <PanelRightCloseIcon size={20} />
            )}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded, setExpanded }}>
          <ul role="navigation-items" className="flex-1 px-3">
            {children}
          </ul>
        </SidebarContext.Provider>
      </div>
    </aside>
  );
}

export function SidebarItem({
  icon,
  text,
  href,
  alert
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
  alert?: boolean;
}) {
  const { expanded } = useSidebarContext();
  const pathname = usePathname();
  const activePath = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`relative flex items-center py-2 px-3 text-sm font-medium rounded-md cursor-pointer transition-colors group ${
          activePath
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          } `}
        >
          {text}
        </span>

        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded} ? "" : "top-2`}
          />
        )}

        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {text}
          </div>
        )}
      </Link>
    </li>
  );
}
