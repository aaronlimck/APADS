"use server";
import prisma from "@/lib/prisma";
import { getAllUsers } from "./user.action";
import { render } from "@react-email/components";
import { SelfEvaluation } from "@/emails/self-evaluation";
import { sendEmail } from "@/lib/api/email";

/**
 * @description Create appraisal form
 * @param data name, description, content
 * @returns {Promise<{status: number, message: string, data: any}>}
 */
export async function createAppraisal(data: any) {
  try {
    const form = await prisma.appraisalForm.create({
      data: {
        name: data.name,
        description: data.description,
        content: data.content,
      },
    });
    return { status: 201, message: "Created form successfully!", data: form };
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong, please try again later!");
  }
}

/**
 * @description Get all appraisal forms
 * @returns {Promise<{status: number, data: any}>}
 */
export async function getAllAppraisals() {
  try {
    const appraisals = await prisma.appraisalForm.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { status: 200, data: appraisals };
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong, please try again later!");
  }
}

/**
 * @description Get appraisal form by id
 * @param id
 * @returns {Promise<{status: number, data: any}>}
 */
export async function getAppraisalFormById(id: string) {
  try {
    const form = await prisma.appraisalForm.findUnique({
      where: { id: id },
      include: { recipientsId: true },
    });
    return { status: 200, data: form };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}

/**
 * @description Update appraisal form content by id
 * @param id
 * @param jsonContent
 * @returns {Promise<{status: number, message: string, data: any}>}
 */
export async function updateAppraisalFormId(id: string, jsonContent: string) {
  try {
    const form = await prisma.appraisalForm.update({
      where: { id: id },
      data: {
        content: jsonContent,
      },
    });
    return { status: 200, message: "Updated form successfully!", data: form };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}

/**
 * @description Update appraisal form title by id
 * @param id
 * @param name
 * @returns {Promise<{status: number, message: string, data: any}>}
 */
export async function updateAppraisalFormTitleById(id: string, name: string) {
  try {
    const form = await prisma.appraisalForm.update({
      where: { id: id },
      data: {
        name: name,
      },
    });
    return {
      status: 200,
      message: "Updated form title successfully!",
      data: form,
    };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}

export async function publishAppraisalFormByDepartments(payload: any) {
  try {
    // Fetch users in parallel
    const usersPromise = getAllUsers({ isArchived: false });
    const users = await usersPromise;

    const recipients = users.data
      .filter((user) =>
        payload.recipientsDepartment.includes(user.departmentName),
      )
      .map((user) => ({ id: user.id, name: user.name, email: user.email }));

    // Parallelize email sending
    const emailPromises = recipients.map(async (recipient) => {
      const email = render(
        SelfEvaluation({ name: recipient.name, appraisalId: payload.id }),
      );
      await sendEmail(
        recipient.email,
        "Self-Evaluation Appraisal Assigned - Action Required",
        email,
      );
    });
    await Promise.all(emailPromises);

    // Extract recipient IDs
    const recipientIds = recipients.map((recipient) => recipient.id);
    // Create an array of objects with the appropriate structure for Prisma
    const recipientIdRelations = recipientIds.map((id) => ({ id }));

    // Update appraisal form
    const response = await prisma.appraisalForm.update({
      where: { id: payload.id },
      data: {
        content: payload.content,
        isPublished: true,
        recipientsId: { connect: recipientIdRelations },
      },
    });

    return {
      status: 200,
      message: "Appraisal successfully sent!",
      data: response,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong, please try again later!");
  }
}

export async function getAppraisalFormContentById(id: string) {
  try {
    const form = await prisma.appraisalForm.findUnique({
      where: { id: id, isPublished: true },
      select: { content: true, recipientsId: true },
    });
    return { status: 200, message: "Successully fetch content", data: form };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}

export async function getAppraisalFormSubmissionsByFormId(id: string) {
  try {
    const form = await prisma.appraisalSubmissions.findMany({
      where: { formId: id },
    });
    return { status: 200, message: "Successully fetch content", data: form };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}

export async function getAppraisalFormSubmissionByFormIdAndUserId(
  id: string,
  userId: string,
) {
  try {
    const form = await prisma.appraisalSubmissions.findUnique({
      where: { formId_employeeId: { formId: id, employeeId: userId } },
    });
    return { status: 200, message: "Successully fetch content", data: form };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}

export async function getAppraisalSubmissionByFormId(id: string) {
  try {
    const form = await prisma.appraisalSubmissions.findUnique({
      where: { id: id },
    });
    return { status: 200, message: "Submission successful!", data: form };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}

export async function updateAppraisalSubmissionByFormId(
  id: string,
  payload: any,
) {
  try {
    const form = await prisma.appraisalSubmissions.update({
      where: { id: id },
      data: {
        content: payload.content,
        hasManagerAppraise: payload.hasManagerAppraise,
      },
    });
    return {
      status: 200,
      message: "Updated submission successfully!",
      data: form,
    };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}
