import { getAppraisalFormContentById } from "@/actions/appraisal.action";
import { notFound } from "next/navigation";
import { FormElementInstance } from "@/components/form-builder/form-elements";
import ViewerComponent from "@/components/viewer/viewer-component";

export default async function AdminAppraisalsFormViewerPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const form = await getAppraisalFormContentById(id);

  if (!form || !form.data) {
    return notFound();
  }
  const formContent = JSON.parse(form.data.content) as FormElementInstance[];

  return <ViewerComponent content={formContent} />;
}
