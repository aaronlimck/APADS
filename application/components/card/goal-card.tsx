"use client"
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { deleteGoalbyId } from "@/actions/goal.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function GoalCard({ data }: { data: any }) {
  const router = useRouter()
  
  const deleteGoal = async (id:any) =>{
    console.log(id)
    try{
      const response = await deleteGoalbyId(id);
      if(response.status==201){
        toast.success("Goal deleted")
        router.refresh()
        return response.data
      }
    }catch(error){
      console.error("Error deleting goal")
    }
  }

  const goal = data.description.split(".");
  return (
    <Card className="p-4">
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem value="item-1" className="border-0">
          <AccordionTrigger className="text-left hover:no-underline">
            <div>
              <div className="font-semibold">{goal[0].split(":")[1]}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {data.description.split(".").map(
              (description: any, index: any) =>
                index !== 0 && (
                  <div key={index} className="mb-1 text-sm">
                    <span className="font-semibold">
                      {description.split(":")[0]}
                    </span>
                    <span>{description.split(":")[1]}</span>
                  </div>
                ),
            )}
            <Button className="mt-2" variant={"destructive"} onClick={()=>deleteGoal(data.id)}>
              Delete Goal
            </Button>
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
