import { getAppraisalFormById } from "@/actions/appraisal.action";
import { getAppraisalTemplateById } from "@/actions/template.action";
import DesginerContextProvider from "@/components/form-builder/context/designer-context";
import FormBuilder from "@/components/form-builder/form-builder";

export default async function AdminAppraisalsBuilderPage({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { id: string };
}) {
  const { id } = params;

  const isTemplate =
    typeof searchParams.type === "string" ? searchParams.type : "";

  if (isTemplate === "template") {
    const formData = await getAppraisalTemplateById(id);
    if (!formData) {
      throw new Error("Template not found");
    }
    return (
      <DesginerContextProvider>
        {/* @ts-ignore */}
        <FormBuilder form={formData.data} isTemplate={!!isTemplate} />
      </DesginerContextProvider>
    );
  } else {
    const formData = await getAppraisalFormById(id);
    if (!formData) {
      throw new Error("Form not found");
    }
    return (
      <DesginerContextProvider>
        {/* @ts-ignore */}
        <FormBuilder form={formData.data} />
      </DesginerContextProvider>
    );
  }
}
