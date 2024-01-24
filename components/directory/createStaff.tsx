"use client";
import { GetDepartment } from "@/actions/department.action";
import { createStaff } from "@/actions/staff.action";
import { createUser } from "@/actions/user.action";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Combobox } from "../ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import RoleSelect from "./roleSelect";
import { convertTextToTitleCase } from "@/lib/utils";

export function CreateModal() {
  const router = useRouter();
  const roleData = ["ADMIN", "MANAGER", "STAFF"];
  const [departmentNames, setDepartmentNames] = useState<String[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentData = await GetDepartment();
        const namesArray = departmentData.map((department) => department.name);
        setDepartmentNames(namesArray);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    manager: ""
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    department: false,
    role: false,
    manager: false
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const handleRoleSelection = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: value
    }));
  };

  const handleDepartmentSelection = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      department: value
    }));
  };

  const handleAddStaff = async () => {
    const errors = {
      name: !formData.name,
      email: !formData.email,
      department: !formData.department,
      role: !formData.role,
      manager: !formData.manager
    };
    setFormErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      toast.error("Please fill in all fields.");
      return false;
    }

    try {
      const userResponse = await createUser(formData);
      if (userResponse.status === 201) {
        const staffData = {
          id: userResponse.data.id,
          departmentName: convertTextToTitleCase(formData.department)
        };
        const create = await createStaff(staffData);
        if (create.status !== 201) {
          toast.error("Error creating Staff");
        }
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Error creating User, Check if User exists");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center font-normal text-sm capitalize space-x-2"
          onClick={() => setIsOpen(true)}
        >
          <span className="text-xl sm:text-base">+</span>
          <span className="hidden sm:block">New employee</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Employee</DialogTitle>
          <DialogDescription>
            Fill in the required details to create a new employee
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              className={
                formErrors.name
                  ? "border-red-300 bg-red-50 col-span-3"
                  : "col-span-3"
              }
              onChange={handleInputChange}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className={
                formErrors.email
                  ? "border-red-300 bg-red-50 col-span-3"
                  : "col-span-3"
              }
              onChange={handleInputChange}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="role">Role</Label>
            <RoleSelect
              data={roleData}
              onSelect={(value) => handleRoleSelection(value)}
              className={
                formErrors.role
                  ? "border-red-300 bg-red-50 col-span-3 "
                  : "col-span-3"
              }
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="department">Department</Label>
            <Combobox
              dataList={departmentNames as string[]}
              inputPlaceholder="Select an department..."
              onSelect={(value) => handleDepartmentSelection(value)}
              className={
                formErrors.department
                  ? "border-red-300 bg-red-50 col-span-3"
                  : "col-span-3"
              }
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="manager">Manager</Label>
            <Input
              id="manager"
              type="text"
              placeholder="Toni Kross"
              className={
                formErrors.manager
                  ? "border-red-300 bg-red-50 col-span-3"
                  : "col-span-3"
              }
              onChange={handleInputChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => handleAddStaff()}>Create Employee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
