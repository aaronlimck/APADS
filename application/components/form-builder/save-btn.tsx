import { Loader2Icon, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import useDesigner from "./hooks/useDesigner";
import { updateAppraisalFormId } from "@/actions/appraisal.action";

export default function SaveBtn({ id }: { id: string }) {
  const router = useRouter();
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const JsonElements = JSON.stringify(elements);
      const response = await updateAppraisalFormId(id, JsonElements);
      if (response && response.status === 200) {
        toast.success(response.message);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex gap-2 text-muted-foreground"
      disabled={loading}
      onClick={() => startTransition(updateFormContent)}
    >
      {loading ? (
        <Loader2Icon className="animate-spin" size={16} />
      ) : (
        <>
          <SaveIcon size={16} />
          <span>Save</span>
        </>
      )}
    </Button>
  );
}
