import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function WorkflowPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight select-none">
          Workflows
        </h1>

        <Button className="font-normal capitalize rounded-full space-x-2">
          <PlusIcon size={16} />
          <span>New workflow</span>
        </Button>
      </div>
    </div>
  );
}
