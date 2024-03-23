import { getDepartment } from "@/actions/department.action";
import { updateUserById } from "@/actions/user.action";
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

export default function EmploymentDetail({ data }: { data: any }) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<"DEFAULT" | "EDIT">(
    "DEFAULT",
  );
  const [departmentNames, setDepartmentNames] = useState<String[]>([]);
  const [form, setForm] = useState({
    jobTitle: data.jobTitle || "",
    department: data.departmentName || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentData = await getDepartment();
        const namesArray = departmentData.map((department) => department.name);
        setDepartmentNames(namesArray);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, [setDepartmentNames]);

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission behavior

    const payload = {
      jobTitle: form.jobTitle,
      departmentName: form.department,
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
            <div className="font-medium">Employment Details</div>
            <div
              className="text-muted-foreground"
              onClick={() => setCurrentStatus("EDIT")}
            >
              Edit
            </div>
          </div>

          <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm leading-6 text-muted-foreground">
              Job Title
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {data.jobTitle || "N/A"}
            </dd>

            <dt className="text-sm leading-6 text-muted-foreground">
              Department
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {convertTextToTitleCase(data.departmentName) || "N/A"}
            </dd>
          </div>
        </Card>
      )}

      {currentStatus === "EDIT" && (
        <Card>
          <form onSubmit={handleSaveChanges}>
            <div className="flex items-center justify-between border-b p-4 text-sm">
              <div className="font-medium">Employment Details</div>
            </div>

            <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm leading-6 text-muted-foreground">
                Job Title
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Input
                  name="jobTitle"
                  className="focus-visible:border-[1.5px] focus-visible:border-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={form.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Job Title"
                />
              </dd>

              <dt className="text-sm leading-6 text-muted-foreground">
                Department
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Select
                  name="department"
                  onValueChange={(value) => {
                    form.department = value;
                  }}
                  defaultValue={form.department}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentNames.map((role, index) => (
                      <SelectItem key={index} value={role.toUpperCase()}>
                        {convertTextToTitleCase(role as string)}
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
                className="font-normal text-muted-foreground hover:text-gray-800"
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
