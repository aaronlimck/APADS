"use server";
import prisma from "@/lib/prisma";
import { generateRandomPassword } from "@/lib/utils";

/**
 * Creates a new user in the database.
 * @param {Object} payload - User data payload with name, email, role (ENUM), departmentName.
 * @return {Promise<Object>} Resolves to an object with status code (201), message, and user data.
 * @throws {Error} If there's an error during user creation.
 */
export async function createUser(payload: any) {
  const existingUser = await getUserByEmail(payload.email);
  if (existingUser.status === 200) {
    return { status: 409, error: "User already exists!", data: existingUser };
  }

  const password = await generateRandomPassword(12);
  try {
    const response = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: password,
        role: payload.role,
        departmentName: payload.departmentName,
      },
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

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!users) {
      throw new Error("Error getting users");
    }
    return { status: 200, message: "User fetched", data: users };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting users");
    }
  }
}

/**
 * Get user by email in the database.
 * @param {Object} payload - Email.
 * @return {Promise<Object>} Return user data object.
 * @throws {Error} If there's an error during user creation.
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return { status: 404, message: "No user found", data: user };
    }
    return { status: 200, message: "User found", data: user };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting user");
    }
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        appraisals: true,
        goals: true,
      },
    });
    if (!user) {
      return { status: 404, message: "No user found", data: user };
    }
    return { status: 200, message: "User found", data: user };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting user");
    }
  }
}

/**
 * Get user by id in the database.
 * @param {Object} payload - User Id.
 * @return {Promise<Object>} Return status code 200, message.
 * @throws {Error} If there's an error during user deletion.
 */
export async function deleteUserById(id: string) {
  try {
    const user = await prisma.user.delete({
      where: { id: id },
    });
    if (!user) {
      throw new Error("Error deleting user");
    }
    return { status: 200, message: "User deleted" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error deleting user");
    }
  }
}

export async function getAllUsersByDepartment(departmentName: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        departmentName: departmentName,
      },
    });
    if (!users) {
      throw new Error("Error getting users");
    }
    return { status: 200, message: "User fetched", data: users };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting users");
    }
  }
}

export async function getUserManager(departmentName: string) {
  try {
    const users = await prisma.user.findFirst({
      where: {
        departmentName: departmentName,
        role: "MANAGER",
      },
    });
    if (!users) {
      throw new Error("Error getting users");
    }
    return { status: 200, message: "User fetched", data: users };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting users");
    }
  }
}
