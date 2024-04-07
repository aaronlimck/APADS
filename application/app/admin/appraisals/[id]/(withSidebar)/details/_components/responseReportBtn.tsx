"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClipboardMinusIcon, UsersRoundIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ResponseReportBtn({
  id,
  noOfApprisalSubmission,
}: {
  id: string;
  noOfApprisalSubmission: number;
}) {
  return (
    <>
      {noOfApprisalSubmission < 30 && (
        <Button
          variant="outline"
          className="flex items-center gap-2 border text-muted-foreground hover:text-primary"
          onClick={() => {
            toast.error(
              "Insufficient responses. Requires a minimum of 1 response.",
            );
          }}
        >
          <ClipboardMinusIcon size={16} />
          <span className="font-normal">Response Report</span>
        </Button>
      )}

      {noOfApprisalSubmission >= 30 && (
        <>
          <Link
            href={`/admin/appraisals/${id}/report`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-2 text-muted-foreground hover:text-primary",
            )}
          >
            <ClipboardMinusIcon size={16} />
            <span className="font-normal">Response Report</span>
          </Link>
        </>
      )}
    </>
  );
}
