"use client";
import { use, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { getSession, useSession } from "next-auth/react";
import { createGoal } from "@/actions/goal.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserById } from "@/actions/user.action";
import { SparklesIcon } from "lucide-react";

type ConversationMessage = {
  role: string;
  content: any;
};

export default function GoalModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const userId = session?.user.id;
  const [storedGoal, setStoredGoal] = useState("");
  const formPlaceholder =
    storedGoal !== ""
      ? "Input changes to be made to the SMART Goals"
      : "Tell me more about it";
  const formLabel =
    storedGoal !== ""
      ? "Do you want to edit the SMART Goals?"
      : "Whats your Goal?";
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);

  const makeAiRequest = async (input: string) => {
    try {
      const userResponse = await getUserById(userId!);
      if (userResponse && userResponse.status === 200) {
        const departmentString =
          "Department: " + userResponse.data?.departmentName + "\n";
        const finalPrompt = departmentString.concat("Prompt: " + input);

        const aiResponse = await fetch("/api/generate-smart", {
          method: "POST",
          body: JSON.stringify({
            input: finalPrompt,
            history: conversationHistory,
          }),
        });
        
        if (aiResponse && aiResponse.status === 200) {
          await setConversationHistory(conversationHistory => [
            ...conversationHistory,
            { role: "user", content: finalPrompt }
          ]);
          return aiResponse.json();
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Something went wrong");
      }
    }
  };

  const handleCreateGoal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const description = event.currentTarget.goal.value;

    try {
      const suggestGoal = await makeAiRequest(event.currentTarget.goal.value);
      const temp = suggestGoal;
      const check = await setConversationHistory([
        ...conversationHistory,
        { role: "assistant", content: temp },
      ]);
      setStoredGoal(temp);
    } catch (error) {
      if(error instanceof Error){
        return Error
      }else{
        return "Something went wrong"
      }
    }
  };

const handleAddGoal = async() =>{
      try {
        const goal = await createGoal({ description: storedGoal, userId });
      if (goal && goal.status === 201) {
        toast.success(goal.message);
        setOpen(false);
        router.refresh();
      }
      } catch (error) {
        if(error instanceof Error){
          return Error
        }else{
          return "Failed to create goal"
        }
      }
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Add a new SMART goal</DialogTitle>
          <DialogDescription>What do you want to achieve?</DialogDescription>
        </DialogHeader>
        {storedGoal != "" && (
          <div>
            {storedGoal.split("\n").map((smart, index) => (
              <div key={index}>
                {smart.split(":")[0]}: {smart.split(":")[1]}
              </div>
            ))}
          </div>
        )}
        <form className="space-y-3" onSubmit={handleCreateGoal}>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="goal">{formLabel}</Label>
            <Input
              type="text"
              id="goal"
              placeholder={formPlaceholder}
              className="h-11 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex justify-between">
            <Button
              className="h-11 text-sm font-normal capitalize"
              variant={"outline"}
            >
              Generate goals with AI{" "}
              <SparklesIcon width={16} height={16} className="ml-2" />
            </Button>
            {storedGoal != "" && (
              <Button className="h-11 text-sm font-normal capitalize" onClick={handleAddGoal} >
                Submit
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GoalModalTrigger({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(!open)}>{children}</div>
      <GoalModal open={open} setOpen={setOpen} />
    </>
  );
}
