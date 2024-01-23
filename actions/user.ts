"use server";
import prisma from "@/lib/prisma";

export default async function createUser(UserData:any){
    try{
        await prisma.user.create({
            data:{
                email:UserData.email,
                password:"Password@888",
                name:UserData.name,
                role:UserData.role
            }
        })
        return { status: 201, message: "User created" };
    }catch (error){
        if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error("Error creating new user");
          }
    }
}