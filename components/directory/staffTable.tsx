import { getAllStaffUser } from "@/actions/staff.action";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Badge } from "../ui/badge";

export async function StaffTable() {
  const staffs = await getAllStaffUser();

  return (
    <>
      <div className="hidden sm:block">
        <Table>
          <TableHeader className="bg-[#f7f7f8]">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="px-0 md:px-4">
                <span className="hidden md:block">Email</span>
              </TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Manager</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffs.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell className="px-0 md:px-4">
                  <span className="hidden md:block">{staff.email}</span>
                </TableCell>
                <TableCell>{staff.staff?.departmentName}</TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>Tom</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
                <Badge>{staff.staff?.departmentName}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Email: </span>
                  <span className="text-gray-800">{staff.email}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Manager: </span>
                  <span className="text-gray-800">Tom</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
