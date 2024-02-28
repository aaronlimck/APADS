"use server";
import prisma from "@/lib/prisma";

export async function createGoal(payload: any) {
  const { description, userId } = payload;
  try {
    const goal = await prisma.goal.create({
      data: {
        description: description,
        userId: userId,
      },
    });

    if (!goal) {
      return {
        status: 400,
        message: "Error creating goal",
        data: null,
      };
    }

    return {
      status: 201,
      message: "Goal created successfully",
      data: goal,
    };
  } catch (error) {
    console.log(error);
  }
}
