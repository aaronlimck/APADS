"use client";
import { getAllUsers, updateUserById } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertTextToTitleCase } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ReportingManger({ data }: { data: any }) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<"DEFAULT" | "EDIT">(
    "DEFAULT",
  );
  const [staffName, setStaffName] = useState([] as any);
  const [form, setForm] = useState({
    managerId: data.managerId || "",
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffData = await getAllUsers();
        const filteredNamesArray = staffData.data
          .filter((staff) => staff.isArchived === false)
          .map((staff) => ({
            id: staff.id,
            name: staff.name,
          }));
        setStaffName(filteredNamesArray);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
    fetchStaff();
  }, [setStaffName]);

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission behavior

    const payload = {
      managerId: form.managerId,
    };

    // Call the API to update the user's personal information
    try {
      const response = await updateUserById(data.id, payload);
      if (response.status === 200) {
        toast.success("Personal information updated successfully");
        setCurrentStatus("DEFAULT");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {currentStatus === "DEFAULT" && (
        <Card>
          <div className="flex items-center justify-between border-b p-4 text-sm">
            <div className="font-medium">Reporting Manager</div>
            {data.manager !== null && (
              <div
                className="text-muted-foreground"
                onClick={() => setCurrentStatus("EDIT")}
              >
                Edit
              </div>
            )}
          </div>

          {data.manager !== null ? (
            <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm leading-6 text-muted-foreground">
                Full name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {data.manager?.name}
              </dd>

              <dt className="text-sm leading-6 text-muted-foreground">Email</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {data.manager?.email}
              </dd>

              <dt className="text-sm leading-6 text-muted-foreground">
                Department
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {convertTextToTitleCase(data.departmentName)}
              </dd>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 px-4 py-6 text-sm text-muted-foreground">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 font-normal text-muted-foreground"
                onClick={() => setCurrentStatus("EDIT")}
              >
                Assign Manager
              </Button>
              <span>No reporting manager assigned</span>
            </div>
          )}
        </Card>
      )}

      {currentStatus === "EDIT" && (
        <Card>
          <form onSubmit={handleSaveChanges}>
            <div className="flex items-center justify-between border-b p-4 text-sm">
              <div className="font-medium">Reporting Manager</div>
            </div>

            <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm leading-6 text-muted-foreground">
                Select Reporting Manager
              </dt>

              <dd className="mt-1 flex space-x-2 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Select
                  onValueChange={(value) => (form.managerId = value)}
                  defaultValue={form.managerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffName.map((staff: any, index: any) => (
                      <SelectItem key={index} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </dd>
            </div>

            <div className="flex w-full justify-end space-x-2 border-t px-4 py-3">
              <Button
                size="sm"
                variant="secondary"
                className="font-normal"
                onClick={() => setCurrentStatus("DEFAULT")}
              >
                Cancel
              </Button>

              <Button size="sm" className="font-normal">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  );
}
