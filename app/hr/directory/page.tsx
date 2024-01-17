import { StaffTable } from "@/components/directory/staffTable";
import InputSearch from "@/components/directory/inputSearch";
import { Button } from "@/components/ui/button";

export default function DirectoryPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 md:px-6 py-4">
      <div className="flex justify-between">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold tracking-tight select-none">
            Directory
          </h1>
        </div>
        <div>
          <Button className="text-center sm:text-base">
            <span className="text-xl sm:text-base">+</span>
            <span className="hidden sm:block ">&nbsp;Add new Employee</span>
          </Button>
        </div>
      </div>
      <div className="flex">
        <InputSearch></InputSearch>
        <Button className="border bg-white text-black hover:bg-gray-50 ml-4">
          Filter
        </Button>
      </div>
      <div className="my-4">
        <StaffTable></StaffTable>
      </div>
    </div>
  );
}
