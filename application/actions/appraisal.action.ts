"use server";
import prisma from "@/lib/prisma";

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

export async function updateAppraisalForm(id: string, jsonContent: string) {
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

export async function publishAppraisalForm(payload: any) {
  try {
    const form = await prisma.appraisalForm.update({
      where: { id: payload.id },
      data: {
        recipientsId: {
          connect: payload.recipientsId.map((userId: string) => ({
            id: userId,
          })),
        },
        content: payload.content,
        isPublished: true,
      },
    });
    return { status: 200, message: "Published form successfully!", data: form };
  } catch (error) {
    console.log(error);
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

export async function getAppraisalById(id: string) {
  try {
    const form = await prisma.appraisalForm.findUnique({
      where: { id: id },
      include: { recipientsId: true },
    });
    return { status: 200, message: "Successfully fetch content", data: form };
  } catch (error) {
    throw new Error("Something went wrong, please try again later!");
  }
}

export async function deleteAppraisalById(id: string) {
  try {
    const form = await prisma.appraisalForm.delete({
      where: { id: id },
    });
    return {
      status: 200,
      message: "Successfully delete appraisal",
      data: form,
    };
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
  userId: string
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

export async function createAppraisalSubmissionByFormId(
  id: string,
  userId: string,
  content: string
) {
  try {
    const form = await prisma.appraisalSubmissions.create({
      data: {
        formId: id,
        employeeId: userId,
        content: content,
      },
    });
    return { status: 201, message: "Submission successful!", data: form };
  } catch (error) {
    console.log(error);
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
  payload: any
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
