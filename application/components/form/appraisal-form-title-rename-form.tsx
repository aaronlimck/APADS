"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { updateAppraisalFormTitleById } from "@/actions/appraisal.action";
import { useRouter, useSearchParams } from "next/navigation";
import { updateAppraisalTemplateById } from "@/actions/template.action";

export default function ApprisalFormTitleRenameForm({
  open,
  setOpen,
  formId,
  formName,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  formId: string;
  formName: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTemplate = searchParams.get("type") === "template";

  const [formData, setFormData] = useState({ formName });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleFormTitleUpdate = async () => {
    // alert(formData.formName);
    try {
      if (!isTemplate) {
        const response = await updateAppraisalFormTitleById(
          formId,
          formData.formName
        );
        if (response.status === 200) {
          toast.success(response.message);
          router.refresh();
        } else {
          toast.error(response.message);
        }
      } else {
        const payload = {
          name: formData.formName,
        };
        const response = await updateAppraisalTemplateById(formId, payload);
        if (response.status === 200) {
          toast.success(response.message);
          router.refresh();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Name your form</DialogTitle>
        </DialogHeader>

        <Input
          id="formName"
          type="text"
          className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 focus-visible:border-[1.5px]"
          value={formData.formName}
          onChange={handleInputChange}
        />

        <Button className="font-normal" onClick={handleFormTitleUpdate}>
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
