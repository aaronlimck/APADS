import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";

export function StaffTable() {
  const staffs = [
    {
      name: "John",
      email: "johndoe@example.com",
      department: "Logistics",
      Role: "Clerk",
      Manager: "Tom"
    }
  ];

  return (
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-more-horizontal"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staffs.map((staff) => (
          <TableRow>
            <TableCell>{staff.name}</TableCell>
            <TableCell className="px-0 md:px-4">
              <span className="hidden md:block">{staff.email}</span>
            </TableCell>
            <TableCell>{staff.department}</TableCell>
            <TableCell>{staff.Role}</TableCell>
            <TableCell>{staff.Manager}</TableCell>
            <TableCell>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-more-horizontal"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
