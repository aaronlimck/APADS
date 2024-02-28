"use client";
import { deleteUserById } from "@/actions/user.action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { convertTextToTitleCase } from "@/lib/utils";
import { User } from "@prisma/client";
import { MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export async function StaffTable({ staffs }: { staffs: any[] }) {
  const router = useRouter();

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await deleteUserById(id);
      if (response.status === 200) {
        toast.success(response.message);
        router.refresh();
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="hidden sm:block sm:border sm:rounded-lg bg-white">
        <Table>
          <TableHeader className="bg-[#f7f7f8]">
            <TableRow>
              <TableHead className="rounded-tl-lg">Name</TableHead>
              <TableHead className="px-0 md:px-4">
                <span className="hidden md:block">Email</span>
              </TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="rounded-tr-lg">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {staffs.map((staff: User) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell className="px-0 md:px-4">
                  <span className="hidden md:block">{staff.email}</span>
                </TableCell>
                <TableCell>
                  {convertTextToTitleCase(staff.departmentName)}
                </TableCell>
                <TableCell>{convertTextToTitleCase(staff.role)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant={"outline"}
                        className="text-muted-foreground aspect-square p-1.5 focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0"
                      >
                        <MoreHorizontalIcon
                          className="text-muted-foreground"
                          size={16}
                        />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleDeleteItem(staff.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE VIEW */}
      <div className="flex flex-col gap-3 sm:hidden">
        {staffs.map((staff) => (
          <Card key={staff.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full">
                  <Image
                    className="h-10 w-10 rounded-full"
                    src={"https://ui-avatars.com/api/?name=Elon+Musk&length=1"}
                    fill
                    unoptimized
                    alt="avatar"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-medium">{staff.name}</span>
                  <span className="text-sm text-gray-500">{staff.role}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap py-3">
                <Badge>{staff.departmentName}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Email: </span>
                  <span className="text-gray-800">{staff.email}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
