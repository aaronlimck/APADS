import { getAppraisalFormContentById } from "@/actions/appraisal.action";
import { getAppraisalSubmissionByFormIdANDUserId } from "@/actions/appraisalSubmission";
import { getUserById } from "@/actions/user.action";
import { authConfig } from "@/auth.config";
import ErrorComponent from "@/components/error/error";
import { FormElementInstance } from "@/components/form-builder/form-elements";
import AppraisalFormSubmit from "@/components/form/appraisal-form-submit";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function AppraisalFormPage({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { id: string };
}) {
  const { id } = params;

  const session = await getServerSession(authConfig);
  const userRole = session?.user?.role!;
  const userId = session?.user?.id!;

  /* Fetch employeeResponseFormId from query params */
  const employeeResponseFormId =
    typeof searchParams.employeeResponseFormId === "string"
      ? searchParams.employeeResponseFormId
      : "";

  /* Fetch employeeId from query params */
  const employeeId =
    typeof searchParams.employeeId === "string" ? searchParams.employeeId : "";

  /* Fetch managerId from query params */
  const managerId =
    typeof searchParams.managerId === "string" ? searchParams.managerId : "";

  const form = await getAppraisalFormContentById(id);
  if (!form || !form.data) {
    return notFound();
  }
  const formContent = JSON.parse(form.data.content) as FormElementInstance[];

  /* Check if user has permission to access the form */
  if (userRole === "ADMIN") {
    throw new Error("You are not allowed to access this page");
  } else if (employeeResponseFormId && employeeId && managerId) {
    /* User is a manager */
    if (userId !== managerId) {
      return ErrorComponent({
        title: "Access Denied",
        message: "You do not have permission to review the employee",
      });
    } else {
      const appraisalResponse = await getAppraisalSubmissionByFormIdANDUserId({
        formId: id,
        userId: employeeId,
      });
      if (appraisalResponse.data?.hasManagerAppraise) {
        return ErrorComponent({
          title: "Appraisal Completed",
          message:
            "You have already review the employee. Duplicate submissions are not allowed.",
        });
      }
      const employeeResponse = await getUserById(employeeId);
      if (employeeResponse.status !== 200 || !employeeResponse.data) {
        return ErrorComponent({
          title: "Something went wrong",
          message: "Please try again later",
        });
      } else {
        return (
          <AppraisalFormSubmit
            formId={id}
            content={formContent}
            userId={userId}
            userRole={"MANAGER"}
            employeeData={employeeResponse.data}
            employeeResponseFormId={employeeResponseFormId}
          />
        );
      }
    }
  } else if (userRole === "STAFF") {
    /* Check if employee has already submitted the appraisal */
    const isStaffSubmissionExistResponse =
      await getAppraisalSubmissionByFormIdANDUserId({
        formId: id,
        userId: userId,
      });
    if (isStaffSubmissionExistResponse.status === 200) {
      return ErrorComponent({
        title: "Appraisal Completed",
        message:
          "You have already submitted your appraisal. Duplicate submissions are not allowed.",
      });
    } else {
      if (
        !form.data.recipientsId?.some((recipient) => recipient.id === userId)
      ) {
        return ErrorComponent({
          title: "Access Denied",
          message: "You do not have permission to access this appraisal",
        });
      } else {
        const employeeResponse = await getUserById(userId);
        return (
          <AppraisalFormSubmit
            formId={id}
            content={formContent}
            userId={userId}
            userRole={"STAFF"}
            employeeData={employeeResponse.data}
            employeeResponseFormId={employeeResponseFormId}
          />
        );
      }
    }
  }
}
