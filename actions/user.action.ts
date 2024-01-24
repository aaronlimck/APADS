"use server";
import prisma from "@/lib/prisma";
import { generateRandomPassword } from "@/lib/utils";

/**
 * Creates a new user in the database.
 *
 * @param {Object} payload - User data payload with name, email, password (ENCRYPT) and role (ENUM).
 * @return {Promise<Object>} Resolves to an object with status code (201), message, and user data.
 * @throws {Error} If there's an error during user creation.
 */
export async function createUser(payload: any) {
  const password = await generateRandomPassword(12);
  try {
    const response = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: password,
        role: payload.role
      }
    });

    if (!response) {
      throw new Error("Error creating new user");
    }
    return { status: 201, message: "User created", data: response };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error creating new user");
    }
  }
}

/**
 * Get user by email in the database.
 *
 * @param {Object} payload - Email.
 * @return {Promise<Object>} Return user data object.
 * @throws {Error} If there's an error during user creation.
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      throw new Error("Error getting user");
    }
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting user");
    }
  }
}
