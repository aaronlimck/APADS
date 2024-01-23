"use server";
import prisma from "@/lib/prisma";

export default async function createStaff(UserData:any,User:any){
    try{
        await prisma.staff.create({
            data:{
                user:User,
                department:UserData.department

            }
        })
        return { status: 201, message: "Staff created" };
    }catch (error){
        if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error("Error creating new Staff");
          }
    }
}