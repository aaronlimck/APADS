"use client";
import { updateUserById } from "@/actions/user.action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { convertTextToTitleCase } from "@/lib/utils";
import { MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import StaffInfoSheet from "./staffInfoSheet";

export function StaffTable({ staffs }: { staffs: any[] }) {
  const router = useRouter();

  const handleArchiveToggle = async (id: string, isArchived: boolean) => {
    try {
      const response = await updateUserById(id, { isArchived: !isArchived });
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
      <div className="hidden bg-white sm:block sm:rounded-lg sm:border">
        <Table>
          <TableHeader className="bg-[#f7f7f8]">
            <TableRow>
              <TableHead className="rounded-tl-lg">Name</TableHead>
              <TableHead className="px-0 md:px-4">
                <span className="hidden md:block">Email</span>
              </TableHead>
              <TableHead>Department</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="rounded-tr-lg">
                <span className="invisible">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {staffs.map((staff) => (
              <TableRow key={staff.id} className="group">
                <TableCell>
                  <StaffInfoSheet
                    className="text-left group-hover:underline group-hover:underline-offset-2"
                    data={staff}
                  >
                    {staff.name}
                  </StaffInfoSheet>
                </TableCell>

                <TableCell className="px-0 md:px-4">
                  <span className="hidden md:block">{staff.email}</span>
                </TableCell>

                <TableCell>
                  {convertTextToTitleCase(staff.departmentName)}
                </TableCell>

                <TableCell>{convertTextToTitleCase(staff.role)}</TableCell>

                <TableCell>
                  <span
                    className={`rounded ${staff.isArchived ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"} px-2.5 py-0.5 text-xs font-normal`}
                  >
                    {staff.isArchived ? "Inactive" : "Active"}
                  </span>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="aspect-square p-0 text-muted-foreground focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0"
                      >
                        <MoreHorizontalIcon
                          className="text-muted-foreground"
                          size={16}
                        />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="w-full cursor-pointer"
                        asChild
                      >
                        <StaffInfoSheet data={staff}>View</StaffInfoSheet>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          handleArchiveToggle(staff.id, staff.isArchived)
                        }
                      >
                        {staff.isArchived ? "Unarchive" : "Archive"}
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
