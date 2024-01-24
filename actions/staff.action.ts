"use server";
import prisma from "@/lib/prisma";

export async function createStaff(payload: any) {
  try {
    await prisma.staff.create({
      data: {
        userId: payload.id,
        departmentName: payload.departmentName
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
        staff: {
          include: {
            department: true
          }
        }
      }
    });

    return usersWithStaff;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error();
    } else {
      throw new Error("Error retrieving staff information");
    }
  }
}
