import {
  getAppraisalFormContentById,
} from "@/actions/appraisal.action";
import { notFound } from "next/navigation";
import {
  FormElementInstance,
  FormElements,
} from "@/components/form-builder/form-elements";

export default async function AdminAppraisalsBuilderPage({
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

    return (
      <>
        <div className="border-b p-4">
          <p className="text-muted-foreground">Form Preview</p>
        </div>
        <div className="flex flex-grow flex-col items-center justify-center overflow-y-auto bg-accent p-4 pt-[76px]">
          <div className="flex min-h-dvh w-full max-w-3xl flex-grow flex-col gap-4 space-y-4 bg-white px-4 py-8">
            {formContent.map((element) => {
              console.log(element.type)
              const FormElement = FormElements[element.type].formComponent;
              return (
                <>
                  <FormElement
                    key={element.id}
                    elementInstance={element}
                  />
                </>
              );
            })}
          </div>
        </div>
      </>
    );
}