import { getAllUsers } from "@/actions/user.action";
import StaffTableStatus from "@/components/dropdown/staff-table-status";
import { StaffTable } from "@/app/admin/employees/_components/staffTable";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const status =
    typeof searchParams.status === "string" ? searchParams.status : "active"; // default to active

  const isArchived =
    status === "all" ? undefined : status === "active" ? false : true;

  const staffData = await getAllUsers({ isArchived });

  return (
    <main className="space-y-6">
      <div className="space-y-3">
        <StaffTableStatus statusSelected={status} />

        <StaffTable staffs={staffData.data} />
      </div>
    </main>
  );
}
