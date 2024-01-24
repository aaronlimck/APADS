"use server";
import prisma from "@/lib/prisma";

export default async function createStaff(userData: any, user: any) {
  try {
    await prisma.staff.create({
      data: {
        user: {
          connect: { id: user.id }, // Use connect with the user's id
        },
        department: {
          connect: { name: userData.department },
        },
      }
    });
    return { status: 201, message: "Staff created" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error creating new Staff");
    }
  }
}

export async function getAllStaffUser() {
  try {
    const usersWithStaff = await prisma.user.findMany({
      include: {
        Staff: {
          include: {
            department: true,
          },
        },
      },
    });

    return usersWithStaff;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error;
    } else {
      throw new Error("Error retrieving staff information");
    }
  }
}