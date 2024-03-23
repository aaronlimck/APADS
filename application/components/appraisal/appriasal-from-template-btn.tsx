"use client";
import { createAppraisalFromTemplate } from "@/actions/template.action";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function CreateAppraisalFromTemplateBtn({
  templateId,
}: {
  templateId: string;
}) {
  const router = useRouter();

  const handleCreateAppriasal = async () => {
    try {
      const response = await createAppraisalFromTemplate(templateId);
      if (response && response.status === 201) {
        toast.success(response.message);
        router.push(`/admin/appraisals/${response.data.id}/builder`);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      className="w-full cursor-pointer font-normal"
      variant="secondary"
      onClick={handleCreateAppriasal}
    >
      Use Template
    </Button>
  );
}
