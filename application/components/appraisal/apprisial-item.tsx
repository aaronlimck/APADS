"use client";
import { getAppraisalSubmissionByFormIdANDUserId } from "@/actions/appraisalSubmission";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export default function ApprisalItem({
  userId,
  data,
}: {
  userId?: string;
  data: any;
}) {
  const [isSubmissionExist, setIsSubmissionExist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAppraisalSubmissionByFormIdANDUserId({
        formId: data.id,
        userId: userId,
      });
      if (response.data.length > 0) {
        setIsSubmissionExist(true);
      }
    };
    fetchData();
  }, [userId, data.id]);

  return (
    <div className="flex flex-col space-y-4 rounded-sm border p-4 pb-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">{data.name}</div>
          {/* TO-DO: INCLUDE STATUS - COMPLETE OR INCOMPLETE */}

          {isSubmissionExist ? (
            <Badge className="bg-green-100 font-normal capitalize text-green-800 hover:bg-green-100 hover:text-green-800">
              Complete
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 font-normal capitalize text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">
              Incomplete
            </Badge>
          )}
        </div>
        <div className="line-clamp-3 text-sm text-muted-foreground">
          {data.description}
        </div>
      </div>

      {!isSubmissionExist ? (
        <Link
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "font-normal",
          )}
          href={`/appraisal/${data.id}`}
        >
          Start Evaluation
        </Link>
      ) : (
        <Button
          variant="secondary"
          className="cursor-pointer font-normal"
          disabled
        >
          Start Evaluation
        </Button>
      )}
    </div>
  );
}

export function ApprisalItemSkeleton() {
  return (
    <Skeleton className="border-primary-/20 h-[120px] w-full animate-pulse border-2" />
  );
}

export function ApprisalItemEmptyState() {
  return (
    <div className="flex flex-col items-center rounded-sm border p-4 pb-6">
      <div className="relative h-28 w-28">
        <Image src="/checklist.png" fill={true} alt="checked" />
      </div>
      <div className="font-medium">No assigned appraisal</div>
      <div className="text-sm text-muted-foreground">
        Hurray! Nothing to review or assess at the moment
      </div>
    </div>
  );
}
