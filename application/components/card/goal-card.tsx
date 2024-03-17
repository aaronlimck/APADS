import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function GoalCard({ data }: { data: any }) {
  const goal = data.description.split(".");
  return (
    <Card className="p-4">
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem value="item-1" className="border-0">
          <AccordionTrigger className="hover:no-underline text-left">
            {goal[0]}
          </AccordionTrigger>
          <AccordionContent>
            {data.description.split(".").map((descriptions: any) => (
              <div>{descriptions}</div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

export function GoalCardSkeleton() {
  return (
    <Skeleton className="border-accent-/90 h-[60px] w-full animate-pulse border-2" />
  );
}
