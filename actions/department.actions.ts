"use server";
import prisma from "@/lib/prisma";

export async function GetDepartment() {
  try {
    const departments = await prisma.department.findMany();
    return departments;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error retrieving departments from the database");
    }
  }
}
