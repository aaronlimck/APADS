import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "../hooks/useDesigner";
import { UpdateTemplateContent } from "@/actions/template";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateTemplateContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateTemplateContent(id, jsonElements);
      toast.success("Success", {
        description: "Your template has been saved!"
      });
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong!"
      });
    }
  };
  return (
    <Button
      variant={"outline"}
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateTemplateContent);
      }}
    >
      <HiSaveAs className="h-4 w-4" />
      Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
