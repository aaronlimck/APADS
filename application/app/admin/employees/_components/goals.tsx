"use client";
import GoalCard from "@/components/card/goal-card";
import { Card } from "@/components/ui/card";

export default function Goals({ data }: { data: any }) {
  return (
    <div className="h-64 overflow-y-auto">
      <Card>
        <div className="flex items-center justify-between border-b p-4 text-sm">
          <div className="font-medium">Smart Goals</div>
        </div>
        <div className="p-4">
          {data.goals?.length !== 0 ? (
            data.goals?.map((item: any) => {
              return <GoalCard key={item.id} data={item} />;
            })
          ) : (
            <div className="flex flex-col items-center space-y-2 px-4 py-6 text-sm text-muted-foreground">
              Employee has not set goals yet!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
