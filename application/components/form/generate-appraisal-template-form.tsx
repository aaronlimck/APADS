"use client";
import { createAppraisal } from "@/actions/appraisal.action";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { formattedAIFormDataToForm } from "@/lib/utils";

export default function GenerateAppraisalTemplateForm() {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateAppraisalTemplateForm = async ({
    title,
    prompt,
  }: {
    title: string;
    prompt: string;
  }) => {
    try {
      const response = await fetch("/api/generate-template", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to generate template: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedTemplate = await formattedAIFormDataToForm(data);

      if (!generatedTemplate) {
        toast.error("Failed to transform template");
        throw new Error("Failed to transform template");
      }

      const payload = {
        name: title,
        description: null,
        content: JSON.stringify(generatedTemplate),
      };

      const createAppraisalResponse = await createAppraisal(payload);
      if (createAppraisalResponse.status === 201) {
        toast.success("Appraisal created successfully");
        router.push(
          `/admin/appraisals/${createAppraisalResponse.data.id}/builder`,
        );
        router.refresh();
        return createAppraisalResponse;
      }
    } catch (error) {
      console.error("Error generating appraisal template:", error);
      throw error;
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !prompt) {
      console.error("Title and prompt are required.");
      setIsLoading(false);
      return;
    }

    const payload = {
      title,
      prompt,
    };

    try {
      const response = await generateAppraisalTemplateForm(payload);
      console.log("response on submit", response);
    } catch (error) {
      console.error("Error in handleOnSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleOnSubmit}>
      <Input
        type="text"
        id="title"
        name="title"
        placeholder="Apprisal Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div>
        <Textarea
          id="prompt"
          name="prompt"
          placeholder="Write a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="mt-2 text-xs text-muted-foreground">
          Suggestion: Design a performance appraisal template for the Sales
          Department to evaluate their monthly sales performance.
        </div>
      </div>

      <Button type="submit" className="w-full">
        {isLoading ? (
          <Loader2Icon size={16} className="animate-spin text-white" />
        ) : (
          "Generate"
        )}
      </Button>
    </form>
  );
}
