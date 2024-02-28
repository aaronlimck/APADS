"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { Badge } from "../ui/badge";

export default function ApprisalItemStaffManager({ data }: { data: any }) {
  return (
    <div className="flex flex-col border rounded-sm space-y-4 p-4 pb-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">{data.name}</div>
          {/* TO-DO: INCLUDE STATUS - COMPLETE OR INCOMPLETE */}
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800 font-normal capitalize">
            Incomplete / Compelete
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground line-clamp-3">
          {data.description}
        </div>
      </div>
      <Button variant="secondary" className="font-normal cursor-pointer">
        <Link href={`/appraisal/${data.id}`} className="w-full">
          Self-evaluate
        </Link>
      </Button>
    </div>
  );
}

export function ApprisalItemStaffManagerSkeleton() {
  return (
    <Skeleton className="border-2 border-primary-/20 h-[120px] w-full animate-pulse" />
  );
}

export function ApprisalItemStaffManagerEmptyState() {
  return (
    <div className="flex flex-col items-center border rounded-sm p-4 pb-6">
      <div className="relative w-28 h-28">
        <Image src="/checklist.png" fill={true} alt="checked" />
      </div>
      <div className="font-medium">No assigned appraisal</div>
      <div className="text-sm text-muted-foreground">
        Hurray! Nothing to review or assess at the moment
      </div>
    </div>
  );
}
