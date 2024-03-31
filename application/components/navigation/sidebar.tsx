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
      "useSidebarContext must be used within a SidebarContext.Provider",
    );
  }
  return context;
};

export default function SidebarContainer({
  classname,
  children,
}: {
  classname?: string;
  children: React.ReactNode;
}) {
  const storedExpanded =
    typeof window !== "undefined"
      ? localStorage.getItem("sidebarExpanded")
      : null;
  const initialExpanded = storedExpanded ? JSON.parse(storedExpanded) : false;
  const [expanded, setExpanded] = React.useState<boolean>(
    initialExpanded || false,
  );

  // Save to localStorage whenever 'expanded' changes
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", JSON.stringify(expanded));
  }, [expanded]);

  return (
    <aside className={`sticky top-0 z-50 h-screen ${classname}`}>
      <div className="flex h-full max-w-[240px] flex-col border-r bg-white shadow-sm">
        <div className="flex items-center justify-between p-4 pb-3">
          <div
            className={`select-none overflow-hidden text-lg font-semibold transition-all ${
              expanded ? "w-32" : "w-0"
            } `}
          >
            APADS
          </div>
          <button
            className="rounded-lg bg-gray-50 p-1.5 hover:bg-gray-100"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? (
              <PanelLeftCloseIcon className="text-gray-600" size={20} />
            ) : (
              <PanelRightCloseIcon className="text-gray-600" size={20} />
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
  alert,
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
  alert?: boolean;
}) {
  const { expanded } = useSidebarContext();
  const pathname = usePathname();
  const activePath = pathname.split("/")[2] === href.split("/")[2];

  return (
    <li>
      <Link
        href={href}
        className={`group relative flex cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          activePath
            ? "bg-accent text-primary"
            : "text-gray-600 hover:bg-accent"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "ml-3 w-52" : "w-0"
          } `}
        >
          {text}
        </span>

        {alert && (
          <div
            className={`absolute right-2 h-2 w-2 animate-ping rounded bg-accent ${expanded} ? "" : "top-2`}
          />
        )}

        {!expanded && (
          <div
            className={`invisible absolute left-full z-50 ml-6 -translate-x-3 rounded-md bg-accent px-2 py-1 text-sm text-primary opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
          >
            {text}
          </div>
        )}
      </Link>
    </li>
  );
}

export function SidebarButton({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  const { expanded } = useSidebarContext();

  return (
    <button
      className={`group relative flex h-[36px] w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-accent`}
      onClick={onClick}
    >
      {icon}
      <span
        className={`overflow-hidden text-left transition-all ${
          expanded ? "ml-3 w-52" : "w-0"
        } `}
      >
        {text}
      </span>
      {!expanded && (
        <div
          className={`invisible absolute left-full z-50 ml-6 -translate-x-3 whitespace-nowrap rounded-md bg-accent px-2 py-1 text-sm text-indigo-800 opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
        >
          {text}
        </div>
      )}
    </button>
  );
}
