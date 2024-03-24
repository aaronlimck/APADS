"use client";
import { updateUserById } from "@/actions/user.action";
import GoalCard from "@/components/card/goal-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function smartGoals({ data }: { data: any }) {

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
            <dd className="mt-1 text-sm leading-6 text-gray-500">
              Employee has not set goals yet!
            </dd>
          )}
        </div>
      </Card>
    </div>
  );
}
