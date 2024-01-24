"use server";
import prisma from "@/lib/prisma";

/**
 * Creates a new user in the database.
 *
 * @param {Object} payload - User data payload with name, email, password (ENCRYPT) and role (ENUM).
 * @return {Promise<Object>} Resolves to an object with status code (201), message, and user ID.
 * @throws {Error} If there's an error during user creation.
 */
export async function createUser(payload: any) {
  try {
    const response = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: "Password@888",
        role: payload.role
      }
    });

    if (!response) {
      throw new Error("Error creating new user");
    }

    return { status: 201, message: "User created", data: response.id };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error creating new user");
    }
  }
}

export async function getUserById(id:any) {
  try{
    const response= await prisma.user.findUnique({
      where:{
        id:id
      }
    });
    if (!response){
      throw new Error("Error finding user")
    }
    return { status:201, message:"User found", data:response}
  }
  catch (error){
    if(error instanceof Error){
      throw new Error(error.message);
    } else{
      throw new Error("Error finding user");
    }
  }
}