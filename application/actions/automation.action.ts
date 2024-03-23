"use server";
import { automationSchema } from "@/schema";
import { z } from "zod";
import prisma from "@/lib/prisma";


export async function createAutomation(
  payload: z.infer<typeof automationSchema>,
  recipient: string[],
) {
  const date = new Date();
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
    const response = await fetch("https://api.cron-job.org/jobs", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.CRONJOB_API_KEY,
      },
      body: JSON.stringify({
        job: {
          requestMethod:1,
          url: "http://127.0.0.1:3000/api/generate-appraisal",
          extendedData: {
            "headers": {
              "Content-Type": "application/json"
            },
            "body": JSON.stringify({ templateId: payload.templateId })
        },
          enabled: "true",
          saveResponses: true,
          schedule: {
            timezone: "",
            expiresAt: 0,
            hours: [0],
            mdays: [1],
            minutes: [-1],
            months: [-1],
            wdays: ["*"],
          },

        },
      }),
    });
    console.log(response)
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
