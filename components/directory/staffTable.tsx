import { MoreHorizontalIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import Image from "next/image";

export function StaffTable() {
  const staffs = [
    {
      id: "1",
      name: "John",
      email: "johndoe@example.com",
      department: "Logistics",
      role: "Clerk",
      manager: "Tom"
    },
    {
      id: "2",
      name: "John",
      email: "johndoe@example.com",
      department: "Logistics",
      role: "Clerk",
      manager: "Tom"
    }
  ];

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
              <TableHead>
                <MoreHorizontalIcon />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffs.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell className="px-0 md:px-4">
                  <span className="hidden md:block">{staff.email}</span>
                </TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>{staff.role}</TableCell>
                <TableCell>{staff.manager}</TableCell>
                <TableCell>
                  <MoreHorizontalIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="sm:hidden">
        
        <div className="w-full grid grid-cols-1 min-w-[540px]:grid-cols-2">
              {staffs.map((staff)=>(
          <div className="m-2" key={staff.id}>
          <Card>
          <CardHeader>
            <div className="relative h-10 w-10 rounded-full">
                <Image className="h-10 w-10 rounded-full" src={"https://ui-avatars.com/api/?name=Elon+Musk&length=1"} fill unoptimized alt="avatar"/>
            </div>
            <CardTitle>{staff.name}</CardTitle>
            <CardDescription>Email: {staff.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Role: {staff.role}</p>
            <p>Department: {staff.department}</p>
            <p>Manager: {staff.manager}</p>
          </CardContent>
        </Card>
        </div>
        ))}
        </div>
        
        
      </div>
    </>
  );
}
