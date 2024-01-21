import { StaffTable } from "@/components/directory/staffTable";
import { Button } from "@/components/ui/button";

export default function DirectoryPage() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight select-none">
          Directory
        </h1>
        <Button
          size="sm"
          className="flex items-center font-normal text-sm rounded-full space-x-2"
        >
          <span className="text-xl sm:text-base">+</span>
          <span className="hidden sm:block">New employee</span>
        </Button>
      </div>

      {/* <div className="flex">
        <InputSearch></InputSearch>
        <Button className="border bg-white text-black hover:bg-gray-50 ml-4">
          Filter
        </Button>
      </div>  */}
      <div className="my-4">
        <StaffTable />
      </div>
    </div>
  );
}
