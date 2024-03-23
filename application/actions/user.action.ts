"use server";
import prisma from "@/lib/prisma";
import { generateRandomPassword } from "@/lib/utils";
import NewAccountEmail from "@/emails/new-account";
import { render } from "@react-email/components";
import { sendEmail } from "@/lib/api/email";

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
        managerId: payload.managerId || null,
      },
    });

    if (!response) {
      throw new Error("Error creating new user");
    }

    if (response) {
      // Send email to user
      const emailHtml = render(
        NewAccountEmail({
          username: payload.name,
          email: payload.email,
          password: password,
        }),
      );
      sendEmail(payload.email, "Welcome to APADS", emailHtml);
    }

    return { status: 201, message: "User created", data: response };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error creating new user");
    }
  }
}

export async function getAllUsers({
  isArchived,
}: { isArchived?: boolean } = {}) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        isArchived: isArchived,
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            departmentName: true,
          },
        },
        appraisals: true,
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
        manager: true,
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

export async function updateUserById(id: string, payload: any) {
  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: payload,
    });
    if (!user) {
      throw new Error("Error updating user");
    }
    return { status: 200, message: "User updated", data: user };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error updating user");
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
