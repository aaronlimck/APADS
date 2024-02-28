"use client";
import { useState } from "react";
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

  const handleAddGoal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const description = event.currentTarget.goal.value;
    const goal = await createGoal({ description: description, userId });
    if (goal && goal.status === 201) {
      toast.success(goal.message);
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Add a new goal</DialogTitle>
          <DialogDescription>What do you want to achieve?</DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleAddGoal}>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="goal">What&apos;s your goal?</Label>
            <Input
              type="text"
              id="goal"
              placeholder="Tell me more about it"
              className="focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
            />
          </div>
          <Button className="text-sm font-normal w-full capitalize h-11">
            Add goal
          </Button>
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
