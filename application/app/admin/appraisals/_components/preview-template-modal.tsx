import { getAppraisalTemplateById } from "@/actions/template.action";
import { FormElementInstance } from "@/components/form-builder/form-elements";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ViewerComponent from "@/components/viewer/viewer-component";

export default async function PreviewTemplateModal({
  templateId,
  children,
}: {
  templateId: string;
  children: React.ReactNode;
}) {
  const form = await getAppraisalTemplateById(templateId);
  if (!form || !form.data) {
    console.log("Form not found");
  }
  const formContent = JSON.parse(form.data.content) as FormElementInstance[];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl sm:px-12">
        <div className="max-h-[600px] overflow-y-auto">
          <ViewerComponent content={formContent} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
