import {
  getAppraisalFormContentById,
  getAppraisalFormSubmissionByFormIdAndUserId,
} from "@/actions/appraisal.action";
import { authConfig } from "@/auth.config";
import ErrorComponent from "@/components/error/error";
import { FormElementInstance } from "@/components/form-builder/form-elements";
import AppraisalFormSubmit from "@/components/form/appraisal-form-submit";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function isStaffSubmissionExistFn(id: string, userId: string) {
  const isSubmissionExist = await getAppraisalFormSubmissionByFormIdAndUserId(
    id,
    userId
  );
  if (isSubmissionExist.data !== null) {
    return true;
  }
  return false;
}

export default async function AppraisalFormPage({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { id: string };
}) {
  /* Fetch form content by id */
  const { id } = params;
  const form = await getAppraisalFormContentById(id);
  if (!form || !form.data) {
    return notFound();
  }

  /**
   * Get employee response form id if exists so that manager responses can be added
   */
  const employeeResponseFormId =
    typeof searchParams.employeeResponseFormId === "string"
      ? searchParams.employeeResponseFormId
      : "";

  const session = await getServerSession(authConfig);
  const userRole = session?.user?.role!;
  const userId = session?.user?.id!;

  /* Check if user has already submitted the appraisal */
  const isStaffSubmissionExist = await isStaffSubmissionExistFn(id, userId);
  if (isStaffSubmissionExist) {
    return ErrorComponent({
      title: "Appraisal Completed",
      message:
        "You have already submitted your appraisal. Duplicate submissions are not allowed.",
    });
  }

  if (userRole === "ADMIN") {
    throw new Error("You are not allowed to access this page");
  } else if (userRole === "STAFF") {
    console.log(form.data.recipientsId);
    if (!form.data.recipientsId?.some((recipient) => recipient.id === userId)) {
      return ErrorComponent({
        title: "Access Denied",
        message: "You do not permission to access this appraisal",
      });
    }
  } else if (
    userRole === "MANAGER" &&
    (employeeResponseFormId === "" || employeeResponseFormId === undefined)
  ) {
    return notFound();
  }

  const formContent = JSON.parse(form.data.content) as FormElementInstance[];
  return (
    <>
      <AppraisalFormSubmit
        formId={params.id}
        content={formContent}
        userId={userId}
        userRole={userRole as Role}
        employeeResponseFormId={employeeResponseFormId}
      />
    </>
  );
}
