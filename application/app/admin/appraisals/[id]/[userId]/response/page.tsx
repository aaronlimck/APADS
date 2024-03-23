import { getAppraisalFormContentById } from "@/actions/appraisal.action";
import { notFound } from "next/navigation";
import { FormElementInstance } from "@/components/form-builder/form-elements";
import ResponseComponent from "@/components/viewer/response-component";
import { getAppraisalSubmissionByFormIdANDUserId } from "@/actions/appraisalSubmission";
import { getUserById } from "@/actions/user.action";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

export default async function AdminAppraisalsFormEmployeeResponseViewerPage({
  params,
}: {
  params: { id: string; userId: string };
}) {
  const { id, userId } = params;
  const session = await getServerSession(authConfig);
  const form = await getAppraisalFormContentById(id);
  const employeeResponse = await getAppraisalSubmissionByFormIdANDUserId({
    formId: id,
    userId: userId,
  });

  const employeeData = await getUserById(userId);

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
        employeeData={employeeData.data}
      />
    </>
  );
}
