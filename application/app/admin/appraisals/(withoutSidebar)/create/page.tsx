import CreateAppraisalByBuilderModal from "@/components/modal/create-appraisal-by-builder-modal";
import GenerateAppraisalAIPromptModal from "@/components/modal/generate-appraisal-AI-prompt-modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminCreateAppraisal() {
  return (
    <div className="min-d-dvh relative flex w-full flex-col items-center justify-center space-y-6 bg-gray-50">
      <Link
        href="/admin/appraisals"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute left-4 top-4 font-normal text-muted-foreground",
        )}
      >
        Back to appraisals
      </Link>

      <div className="text-center">
        <h1 className="text-2xl font-semibold">Create Appraisal</h1>
        <p className="text-muted-foreground">Select an option</p>
      </div>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <Card className="flex flex-col items-center justify-center space-y-4 p-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-medium">Builder</div>
            <p className="text-muted-foreground">Build a form scratch</p>
          </div>
          <CreateAppraisalByBuilderModal>
            <Button
              variant="secondary"
              className="w-full font-normal text-muted-foreground"
            >
              Build
            </Button>
          </CreateAppraisalByBuilderModal>
        </Card>

        <Card className="flex flex-col items-center justify-center space-y-4 p-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-medium">Template</div>
            <p className="text-muted-foreground">
              Select from a prebuilt template
            </p>
          </div>

          <Link
            href="/admin/appraisals//templates"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "w-full font-normal text-muted-foreground",
            )}
          >
            Select template
          </Link>
        </Card>

        <Card className="flex flex-col items-center justify-center space-y-4 p-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-medium">Write a prompt</div>
            <p className="text-muted-foreground">
              Build a from based on a prompt
            </p>
          </div>

          <GenerateAppraisalAIPromptModal>
            <Button
              variant="secondary"
              className="w-full font-normal text-muted-foreground"
            >
              Write
            </Button>
          </GenerateAppraisalAIPromptModal>
        </Card>
      </div>
    </div>
  );
}
