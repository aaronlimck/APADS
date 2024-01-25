import { StaffTable } from "@/components/directory/staffTable";
import { CreateModal } from "@/components/directory/createStaff";

export default function DirectoryPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight select-none">
          Directory
        </h1>
        <CreateModal />
      </div>

      <div className="my-4">
        <StaffTable />
      </div>
    </div>
  );
}
