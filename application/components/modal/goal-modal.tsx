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
import { useSession } from "next-auth/react";
import { createGoal } from "@/actions/goal.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserById } from "@/actions/user.action";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { set } from "date-fns";

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
  const [isLoading, setIsLoading] = useState(false);
  const formPlaceholder =
    storedGoal !== ""
      ? "Eg: Increase Measurable to 20%"
      : "Tell me more about it";
  const formLabel =
    storedGoal !== ""
      ? "Add a prompt to edit your SMART Goal"
      : "What's your goal?";
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);

  const makeAiRequest = async (input: string) => {
    console.log("Hello");
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
          await setConversationHistory((conversationHistory) => [
            ...conversationHistory,
            { role: "user", content: finalPrompt },
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
    const value = event.currentTarget.goal.value;
    event.currentTarget.goal.value = "";

    try {
      setIsLoading(true);
      const suggestGoal = await makeAiRequest(value);
      const temp = suggestGoal;
      const check = await setConversationHistory([
        ...conversationHistory,
        { role: "assistant", content: temp },
      ]);
      setStoredGoal(temp);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        return Error;
      } else {
        return "Something went wrong";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = async () => {
    try {
      console.log(storedGoal);
      let x = storedGoal;
      const goal = await createGoal({ description: x, userId });
      if (goal && goal.status === 201) {
        toast.success(goal.message);
        setOpen(false);
        setStoredGoal("");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) {
        return Error;
      } else {
        return "Failed to create goal";
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new SMART goal</DialogTitle>
          <DialogDescription>What do you want to achieve?</DialogDescription>
        </DialogHeader>
        {storedGoal != "" && (
          <div>
            {storedGoal.split("\n").map((smart, index) => (
              <div key={index}>
                {index === 0 ? (
                  <div className=" mb-2">
                    <span className="font-lg font-bold">
                      {smart.split(":")[0]}
                    </span>
                    : <span>{smart.split(":")[1]}</span>
                  </div>
                ) : (
                  <div className="mb-1 text-sm">
                    <span className="font-semibold">{smart.split(":")[0]}</span>
                    <span>{smart.split(":")[1]}</span>
                  </div>
                )}
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
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Example: </span>I want to be able to
              improve my productivity.
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <Button
              type="submit"
              className="flex h-11 w-full text-sm font-normal capitalize"
              variant={"default"}
            >
              {isLoading ? (
                <Loader2Icon size={16} className="mr-2 animate-spin" />
              ) : (
                <SparklesIcon width={16} height={16} className="mr-2" />
              )}
              <span>
                {storedGoal === ""
                  ? "Generate goals with AI"
                  : "Regenerate goals with AI"}
              </span>
            </Button>

            {storedGoal !== "" && (
              <Button
                type="button"
                variant={"secondary"}
                className="h-11 w-full text-sm font-normal capitalize"
                onClick={handleAddGoal}
              >
                Save current Goal
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Disclaimer: </span> This makes use of
            an AI langauge model (OpenAI GPT-3.5 Turbo). Any content it
            generates may contain errors, inconsistents, or outdate information.
            Please fact-check and verify all AI-generated content before use.
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
