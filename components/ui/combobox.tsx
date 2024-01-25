import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Combobox({
  initValue = "",
  dataList = [],
  inputPlaceholder = "Select from list...",
  noSearchResultPlacehold = "No result found",
  onSelect,
  className,
  dropdownMenuAlignment = "center",
}: {
  initValue?: string;
  dataList: string[];
  inputPlaceholder?: string;
  noSearchResultPlacehold?: string;
  onSelect: (value: string) => void;
  className?: string;
  dropdownMenuAlignment?: "start" | "center" | "end";
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initValue || "");

  const handleItemSelection = (currentValue: string) => {
    const capitalizedValue = capitalizeFirstLetter(currentValue);
    setValue(currentValue === value ? "" : currentValue);
    onSelect(capitalizedValue); // Pass the selected item to the parent component
  };

  const capitalizeFirstLetter = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(`w-full justify-between font-normal`, className)}
        >
          {value ? (
            <span className="capitalize">{value}</span>
          ) : (
            <span >{inputPlaceholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full p-0" align={dropdownMenuAlignment}>
        <Command>
          <CommandInput placeholder={inputPlaceholder} />
          <CommandEmpty>{noSearchResultPlacehold}</CommandEmpty>
          <CommandGroup>
            {dataList.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={(currentValue) => {
                  handleItemSelection(currentValue);
                  setOpen(false);
                }}
              >
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
