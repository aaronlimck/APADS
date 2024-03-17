"use server";
import ManagerEvaluation from "@/emails/manager-evaluation";
import SelfEvaluation from "@/emails/self-evaluation";
import { sendEmail } from "@/lib/api/email";
import prisma from "@/lib/prisma";
import { render } from "@react-email/components";

export async function getAppraisalSubmissionByFormIdANDUserId(payload: any) {
  const { formId, userId } = payload;
  try {
    const form = await prisma.appraisalSubmissions.findFirst({
      where: { formId: formId, employeeId: userId },
    });
    if (!form) {
      return { status: 404, message: "Submission not found!", data: null };
    }
    return { status: 200, message: "Submission successful!", data: form };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}

export async function createAppraisalSubmissionByFormId(
  formId: string,
  userId: string,
  content: string,
  employeeData: any,
) {
  const employeeId = employeeData?.id;
  const employeeName = employeeData?.name;
  const managerId = employeeData?.managerId;
  const managerEmail = employeeData?.manager?.email;
  const managerName = employeeData?.manager?.name;

  try {
    const form = await prisma.appraisalSubmissions.create({
      data: {
        formId: formId,
        employeeId: userId,
        content: content,
      },
    });

    const employeeResponseFormId = form.id;
    const email = render(
      ManagerEvaluation({
        employeeName,
        managerName,
        formId,
        employeeResponseFormId,
        employeeId,
        managerId,
      }),
    );

    await sendEmail(
      managerEmail,
      `Action Required: Complete Evaluation Appraisal for ${employeeName}`,
      email,
    );

    return { status: 201, message: "Submission successful!", data: form };
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong, please try again later!");
  }
}
