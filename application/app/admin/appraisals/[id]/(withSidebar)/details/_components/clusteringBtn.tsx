"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UsersRoundIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ClusteringBtn({
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
              "Insufficient responses, clustering requires a minimum of 30 responses for accurate analysis.",
            );
          }}
        >
          <UsersRoundIcon size={16} />
          <span className="font-normal">Cluster Report</span>
        </Button>
      )}

      {noOfApprisalSubmission >= 30 && (
        <>
          <Link
            href={`/admin/appraisals/${id}/clustering`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-2 text-muted-foreground hover:text-primary",
            )}
          >
            <UsersRoundIcon size={16} />
            <span className="font-normal">Cluster Report</span>
          </Link>
        </>
      )}
    </>
  );
}
