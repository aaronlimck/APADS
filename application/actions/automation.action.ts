"use server";
import { automationSchema } from "@/schema";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { Client } from "@upstash/qstash";

export async function createAutomation(
  payload: z.infer<typeof automationSchema>,
) {
  const date = new Date();
  try {

    const token = process.env.QSTASH_API_TOKEN;
    const dateString = payload.startDate;
    const month = dateString.getMonth() + 1;
    const day = dateString.getDate();

    if (!token) {
      throw new Error("UPSTASH_API_TOKEN environment variable is not set.");
    }
    let cronSchedule: string;

    if (payload.frequency == "3") {
      cronSchedule = `0 0 ${day} ${month},*/3 *`;
    } else if (payload.frequency == "6") {
      cronSchedule = `0 0 ${day} ${month},*/6 *`;
    } else {
      cronSchedule = `0 0 ${day} ${month},*/12 *`;
    }

    const client = new Client({ token: token });
    const schedules = client.schedules;
    await schedules.create({
      destination: `${process.env.CRON_ENDPOINT}/api/generate-appraisal`,
      body: JSON.stringify({ templateId: payload.templateId, department:payload.department }),
      method: "POST",
      cron: cronSchedule,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
        const automation = await prisma.automation.create({
      data: {
        name: payload.name,
        templateId: payload.templateId,
        frequency: payload.frequency,
        startDate: payload.startDate,
        recipientId: payload.department,
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
