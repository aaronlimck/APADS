"use server";
import prisma from "@/lib/prisma";

export async function createNote(payload: any) {
  const { content, userId } = payload;
  try {
    const note = await prisma.note.create({
      data: {
        content: content,
        userId: userId,
      },
    });

    if (!note) {
      return {
        status: 400,
        message: "Error creating note",
        data: null,
      };
    }

    return {
      status: 201,
      message: "Note created successfully",
      data: note,
    };
  } catch (error) {
    console.log(error);
  }
}
