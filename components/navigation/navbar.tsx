"use client";
import { MenuIcon } from "lucide-react";
import MobileNav from "./mobileNav";
import React, { useEffect } from "react";

export default function Navbar() {
  const storedExpanded = localStorage.getItem("mobileNavExpanded");
  const initialExpanded = storedExpanded ? JSON.parse(storedExpanded) : false;
  const [expanded, setExpanded] = React.useState<boolean>(
    initialExpanded || false
  );

  // Save to localStorage whenever 'expanded' changes
  useEffect(() => {
    localStorage.setItem("mobileNavExpanded", JSON.stringify(expanded));
  }, [expanded]);

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between md:justify-end h-14 w-full border-b border-gray-100 bg-white px-4 md:px-6 py-4">
        <button
          className="flex md:hidden p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          onClick={() => setExpanded((current) => !current)}
        >
          <MenuIcon size={20} />
        </button>
        <img
          className="h-8 w-8 rounded-full"
          src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
          alt=""
        />
      </div>

      <MobileNav isOpen={expanded} />
    </>
  );
}
