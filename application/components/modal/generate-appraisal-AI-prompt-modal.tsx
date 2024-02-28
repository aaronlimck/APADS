import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GenerateAppraisalTemplateForm from "../form/generate-appraisal-template-form";

export default function GenerateAppraisalAIPromptModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>Write a prompt</DialogTitle>
          <DialogDescription>Build a form based on a prompt</DialogDescription>
        </DialogHeader>
        <GenerateAppraisalTemplateForm />
        <div className="text-balance text-xs text-muted-foreground/80">
          <span className="font-medium text-muted-foreground">Disclaimer:</span>
          <br />
          This makes use of an AI langauge model (OpenAI GPT-3.5 Turbo). Any
          content it generates may contain errors, inconsistents, or outdate
          information. Please fact-check and verify all AI-generated content
          before use.
        </div>
      </DialogContent>
    </Dialog>
  );
}
