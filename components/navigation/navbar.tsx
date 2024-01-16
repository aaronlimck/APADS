"use client";
import { MenuIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import MobileNav from "./mobileNav";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const userName = session?.user?.name;

  const storedExpanded =
    typeof window !== "undefined"
      ? localStorage.getItem("mobileNavExpanded")
      : null;
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

        <Popover>
          <PopoverTrigger>
            <div className="relative h-8 w-8">
              <Image
                className="h-8 w-8 rounded-full"
                src={`https://ui-avatars.com/api/?name=${userName}&length=1&&background=c7d2fe&color=3730a3`}
                alt={userName + " avatar"}
                fill
                unoptimized
              />
            </div>
          </PopoverTrigger>
          <PopoverContent align="end" className="rounded-xl">
            <div className="flex flex-col items-center">
              <div className="relative h-12 w-12">
                <Image
                  className="h-12 w-12 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${userName}&length=1&&background=c7d2fe&color=3730a3`}
                  alt={userName + " avatar"}
                  fill
                  unoptimized
                />
              </div>
              <p className="text-sm font-medium mt-2">{userName}</p>
            </div>
            <hr className="my-2" />

            <Button
              className="font-normal w-full justify-start capitalize"
              variant="ghost"
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <MobileNav isOpen={expanded} />
    </>
  );
}
