"use client";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { transformGeneratedAITemplateToForm } from "@/lib/utils";
import { Input } from "../ui/input";
import { createAppraisal } from "@/actions/appraisal.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

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

      if (response.status === 400) {
        throw new Error(`Bad request: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedTemplate = await transformGeneratedAITemplateToForm(data);

      if (generatedTemplate) {
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
        }
      }
    } catch (error) {
      console.error("Error generating appraisal template:", error);
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !prompt) {
      console.error("Title and prompt are required.");
      return;
    }

    try {
      const generateAppraisalTemplateFormResponse =
        await generateAppraisalTemplateForm({ title, prompt });
      console.log("response on submit", generateAppraisalTemplateFormResponse);
    } catch (error) {
      console.error("Error in handleOnSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleOnSubmit}>
      <Input
        type="text"
        id="title"
        name="title"
        placeholder="Apprisal Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        id="prompt"
        name="prompt"
        placeholder="Write a prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

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
