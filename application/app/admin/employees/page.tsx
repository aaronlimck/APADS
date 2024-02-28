import { getAllUsers } from "@/actions/user.action";
import { StaffTable } from "@/components/employees/staffTable";

export default async function EmployeesPage() {
  const staffData = await getAllUsers();

  return (
    <main className="space-y-6">
      <StaffTable staffs={staffData.data} />
    </main>
  );
}
