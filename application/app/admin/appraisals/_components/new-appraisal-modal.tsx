"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BlocksIcon, Files, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CreateForm from "../../../../components/form/create-appraisal-form";
import GenerateAppraisalTemplateForm from "../../../../components/form/generate-appraisal-template-form";
import { Card } from "../../../../components/ui/card";

export default function NewAppraisalModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    "BUILDER" | "AI" | undefined
  >(undefined);

  // Reset selected option when the modal is closed
  useEffect(() => {
    setSelectedOption(undefined);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="flex h-full max-h-[320px] max-w-3xl flex-col items-center justify-center">
        {selectedOption === undefined && (
          <>
            <DialogHeader>
              <DialogTitle className="text-balance text-center text-xl">
                Create a new appraisal
              </DialogTitle>
              <DialogDescription className="text-center">
                Start creating your appraisal by selecting the most suitable
                choice
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card
                className="flex flex-col gap-2 rounded-md p-4"
                onClick={() => setSelectedOption("BUILDER")}
              >
                <BlocksIcon size={24} />
                <div>
                  <h2>Builder</h2>
                  <p className="text-sm text-muted-foreground">
                    Build a form from scratch
                  </p>
                </div>
              </Card>

              <Link
                href="/admin/appraisals/templates"
                onClick={() => setOpen(false)}
              >
                <Card className="flex flex-col gap-2 rounded-md p-4">
                  <Files size={24} />
                  <div>
                    <h2>Template</h2>
                    <p className="text-sm text-muted-foreground">
                      Select from a prebuilt form
                    </p>
                  </div>
                </Card>
              </Link>

              <Card
                className="flex flex-col gap-2 rounded-md p-4"
                onClick={() => setSelectedOption("AI")}
              >
                <SparkleIcon size={24} />
                <div>
                  <h2>Write a prompt</h2>
                  <p className="text-sm text-muted-foreground">
                    Generate a form using AI
                  </p>
                </div>
              </Card>
            </div>
          </>
        )}

        {selectedOption === "BUILDER" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-balance text-xl">
                New appraisal
              </DialogTitle>
              <DialogDescription>
                Fill in the details to create a new appraisal
              </DialogDescription>
            </DialogHeader>

            <CreateForm />
          </>
        )}

        {selectedOption === "AI" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-balance text-xl">
                New appraisal
              </DialogTitle>
              <DialogDescription>
                Fill in the details to create a new appraisal
              </DialogDescription>
            </DialogHeader>

            <GenerateAppraisalTemplateForm />

            <div className="text-balance text-xs text-muted-foreground/80">
              <span className="font-medium text-muted-foreground">
                Disclaimer:
              </span>
              <br />
              This makes use of an AI langauge model (OpenAI GPT-3.5 Turbo). Any
              content it generates may contain errors, inconsistents, or outdate
              information. Please fact-check and verify all AI-generated content
              before use.
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
