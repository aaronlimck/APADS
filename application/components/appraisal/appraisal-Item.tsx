import { AppraisalForm } from "@prisma/client";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function AppraisalItem({ form }: { form: AppraisalForm }) {
  return (
    <Card className="h-full max-h-[200px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="line-clamp-1 font-medium">{form.name}</span>
          {form.isPublished ? (
            <Badge className="rounded-md bg-green-100 font-medium text-green-800 hover:bg-green-100 hover:text-green-800">
              Published
            </Badge>
          ) : (
            <Badge className="rounded-md bg-yellow-100 font-medium text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">
              Draft
            </Badge>
          )}
        </CardTitle>

        <CardDescription className="flex flex-col space-y-3">
          <span className="font-normal text-gray-500">
            {formatDistance(form.createdAt, new Date(), {
              addSuffix: true,
            })}
          </span>

          <span className="line-clamp-1 text-gray-800">
            {form.description || "No description"}
          </span>
        </CardDescription>

        <Link
          className={buttonVariants({ variant: "secondary" })}
          href={
            form.isPublished
              ? `/admin/appraisals/${form.id}/details`
              : `/admin/appraisals/${form.id}/builder`
          }
        >
          {form.isPublished ? "View Details" : "Edit Form"}
        </Link>
      </CardHeader>
    </Card>
  );
}

export function AppraisalItemSkeleton() {
  return (
    <Skeleton className="border-primary-/20 h-[200px] w-full animate-pulse border-2" />
  );
}
