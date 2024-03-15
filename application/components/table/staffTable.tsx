"use client";
import { updateUserById } from "@/actions/user.action";
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
import Link from "next/link";
import EditEmployeeModal from "../modal/edit-employee-modal";

export function StaffTable({ staffs }: { staffs: any[] }) {
  const router = useRouter();

  const handleUnarchiveItem = async (id: string) => {
    try {
      const response = await updateUserById(id, { isArchived: false });
      if (response.status === 200) {
        toast.success(response.message);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleArchiveItem = async (id: string) => {
    try {
      const response = await updateUserById(id, { isArchived: true });
      if (response.status === 200) {
        toast.success(response.message);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(staffs);
  return (
    <>
      <div className="hidden bg-white sm:block sm:rounded-lg sm:border">
        <Table>
          <TableHeader className="bg-[#f7f7f8]">
            <TableRow>
              <TableHead className="rounded-tl-lg">Name</TableHead>
              <TableHead className="px-0 md:px-4">
                <span className="hidden md:block">Email</span>
              </TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Reporting Manager</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="rounded-tr-lg">
                <span className="invisible">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {staffs.map((staff: any) => (
              <TableRow key={staff.id} className="group">
                <TableCell className="group-hover:underline group-hover:underline-offset-2">
                  <Link href={`/admin/employees/${staff.id}`}>
                    {staff.name}
                  </Link>
                </TableCell>
                <TableCell className="px-0 md:px-4">
                  <span className="hidden md:block">{staff.email}</span>
                </TableCell>
                <TableCell>
                  {convertTextToTitleCase(staff.departmentName)}
                </TableCell>
                <TableCell>
                  {staff.manager ? staff.manager.name : "NA"}
                </TableCell>
                <TableCell>{convertTextToTitleCase(staff.role)}</TableCell>
                <TableCell>
                  {staff.isArchived ? (
                    <span className="rounded bg-red-100 px-2.5 py-0.5 text-xs font-normal text-red-800">
                      Inactive
                    </span>
                  ) : (
                    <span className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-normal text-green-800">
                      Active
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant={"outline"}
                        className="aspect-square p-0 text-muted-foreground focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0"
                      >
                        <MoreHorizontalIcon
                          className="text-muted-foreground"
                          size={16}
                        />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <EditEmployeeModal
                          staffData={staff}
                          action={
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-fit w-full justify-start p-0 px-2 py-1.5 font-normal"
                            >
                              Edit
                            </Button>
                          }
                        />
                      </DropdownMenuItem>
                      {staff.isArchived ? (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleUnarchiveItem(staff.id)}
                        >
                          Unarchive
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleArchiveItem(staff.id)}
                        >
                          Archive
                        </DropdownMenuItem>
                      )}
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
