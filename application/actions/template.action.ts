"use server";
import prisma from "@/lib/prisma";
import { appraisalTemplateSchema } from "@/schema";
import { z } from "zod";
import { createAppraisal } from "./appraisal.action";

export async function createAppraisalTemplate(
  payload: z.infer<typeof appraisalTemplateSchema>
) {
  const validation = appraisalTemplateSchema.safeParse(payload);
  if (!validation.success) {
    throw new Error("Invalid form data");
  }

  const { name, description } = validation.data;

  try {
    const response = await prisma.template.create({
      data: {
        name: name,
        description: description,
      },
    });

    if (!response) {
      throw new Error("Error creating new appraisal template");
    }

    return {
      status: 201,
      message: "Appraisal template created",
      data: response,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error creating new appraisal template");
    }
  }
}

export async function createAppraisalFromTemplate(id: string) {
  try {
    const templateData = await getAppraisalTemplateById(id);
    if (templateData.status === 200) {
      const payload = {
        name: templateData.data.name,
        description: templateData.data.description,
        content: templateData.data.content,
      };
      const newAppraisalData = await createAppraisal(payload);
      if (newAppraisalData.status === 201) {
        return {
          status: 201,
          message: "Created form successfully!",
          data: newAppraisalData.data,
        };
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong, please try again later!");
  }
}

export async function getAllAppraisalTemplates() {
  try {
    const response = await prisma.template.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!response) {
      throw new Error("Error creating new appraisal template");
    }

    return {
      status: 200,
      message: "Successfully fetch all template",
      data: response,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching appraisal templates");
    }
  }
}

export async function getAppraisalTemplateById(id: string) {
  try {
    const response = await prisma.template.findUnique({
      where: {
        id: id,
      },
    });

    if (!response) {
      throw new Error("Error fetching appraisal template");
    }

    return {
      status: 200,
      message: "Successfully fetch template",
      data: response,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching appraisal template");
    }
  }
}

export async function updateAppraisalTemplateById(id: string, payload: any) {
  try {
    const response = await prisma.template.update({
      where: {
        id: id,
      },
      data: {
        name: payload.name,
        content: payload.content,
      },
    });

    if (!response) {
      throw new Error("Error updating appraisal template");
    }

    return {
      status: 200,
      message: "Successfully update template",
      data: response,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error updating appraisal template");
    }
  }
}
