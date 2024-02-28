"use server";
import { automationSchema } from "@/schema";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function createAutomation(
  payload: z.infer<typeof automationSchema>,
  recipient: string[]
) {
  try {
    const automation = await prisma.automation.create({
      data: {
        name: payload.name,
        templateId: payload.templateId,
        frequency: payload.frequency,
        startDate: payload.startDate,
        recipientId: recipient,
      },
      include: {
        template: true,
      },
    });
    return {
      status: 201,
      message: "Automation created successfully",
      data: automation,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error creating Automation");
    }
  }
}

export async function getAutomation() {
  try {
    const automation = await prisma.automation.findMany({
      include: {
        template: true,
      },
    });
    return {
      status: 200,
      message: "Automation retrieved successfully",
      data: automation,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error retrieving Automation");
    }
  }
}
