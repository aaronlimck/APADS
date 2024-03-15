"use server";
import prisma from "@/lib/prisma";

export async function getAppraisalSubmissionByFormIdANDUserId(payload: any) {
  const { formId, userId } = payload;
  try {
    const form = await prisma.appraisalSubmissions.findMany({
      where: { formId: formId, employeeId: userId },
    });
    return { status: 200, message: "Submission successful!", data: form };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}
