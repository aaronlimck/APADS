"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function StaffTableStatus({
  statusSelected,
}: {
  statusSelected: string;
}) {
  const router = useRouter();
  const setFilter = (filter: string) => {
    router.replace(`?status=${filter}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex h-fit flex-row items-center border-dashed px-3 py-1.5 text-xs font-normal shadow-sm"
        >
          <div className="flex items-center gap-1.5">
            <PlusCircleIcon size={14} />
            <span>Status</span>
          </div>
          <div
            data-orientation="vertical"
            role="none"
            className="mx-2 h-4 w-[1px] shrink-0 bg-border"
          />
          <span className="rounded bg-gray-100 px-2.5 py-0.5 text-xs font-normal capitalize text-gray-800">
            {statusSelected}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <RadioGroup defaultValue={statusSelected} className="gap-0">
          <DropdownMenuItem
            className="flex items-center space-x-2"
            onClick={() => setFilter("all")}
          >
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="font-normal">
              All
            </Label>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center space-x-2"
            onClick={() => setFilter("active")}
          >
            <RadioGroupItem value="active" id="active" />
            <Label htmlFor="active" className="font-normal">
              Active
            </Label>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center space-x-2"
            onClick={() => setFilter("inactive")}
          >
            <RadioGroupItem value="inactive" id="inactive" />
            <Label htmlFor="inactive" className="font-normal">
              Inactive
            </Label>
          </DropdownMenuItem>
        </RadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
