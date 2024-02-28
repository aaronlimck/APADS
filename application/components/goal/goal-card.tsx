import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function GoalCard({ data }: { data: any }) {
  return <Card className="p-4">{data.description}</Card>;
}

export function GoalCardSkeleton() {
  return (
    <Skeleton className="border-2 border-accent-/90 h-[60px] w-full animate-pulse" />
  );
}
