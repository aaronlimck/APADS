import { getAppraisalFormContentById } from "@/actions/appraisal.action";
import { notFound } from "next/navigation";
import { FormElementInstance } from "@/components/form-builder/form-elements";
import ResponseComponent from "@/components/viewer/response-component";
import { getAppraisalSubmissionByFormIdANDUserId } from "@/actions/appraisalSubmission";
import { getUserById } from "@/actions/user.action";

export default async function AdminAppraisalsFormEmployeeResponseViewerPage({
  params,
}: {
  params: { id: string , userId: string};
}) {
  const { id , userId} = params;
  const form = await getAppraisalFormContentById(id);
  const employeeResponse = await getAppraisalSubmissionByFormIdANDUserId({
    formId: id,
    userId: userId,
  });
  const employeeName = (await getUserById(userId)).data?.name as string;

  if (!form || !form.data) {
    return notFound();
  }
  
  const formContent = JSON.parse(form.data.content) as FormElementInstance[];
  const responseContent = JSON.parse(employeeResponse.data?.content as string);
  

  return (
    <>
      <ResponseComponent
        content={formContent}
        response={responseContent}
        appraisalName={form.data.name}
        employeeName={employeeName}
      />
    </>
  );
}
