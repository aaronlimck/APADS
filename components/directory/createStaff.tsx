"use client";
import { Button } from "../ui/button";
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
import { useState } from "react";
import { toast } from "sonner";
import React from "react";
import { Combobox } from "../ui/combobox";

export function CreateModal() {
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
  const handleDepartmentSelection = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      department: value,
    }));
  };
  //hand
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
    // const data={...formData}
    // const isSuccessful = await AddBrands(data);
    //   if (isSuccessful) {
    //     setIsOpen(false);
    //     router.refresh();
    //   }
    // } catch (error) {}

  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center font-normal text-sm rounded-full space-x-2">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              className={
                formErrors.name ? "border-red-300 bg-red-50 col-span-3" : "col-span-3"
              }
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              placeholder="johndoe@example.com"
              className={
                formErrors.email ? "border-red-300 bg-red-50 col-span-3" : "col-span-3"
              }
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Combobox
                dataList={["hi","no"]}
                inputPlaceholder="Select an department..."
                onSelect={(value) => handleDepartmentSelection(value)}
                className={
                  formErrors.department ? "border-red-300 bg-red-50 col-span-3" : "col-span-3"
                }
              />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input
              id="role"
              placeholder="Staff"
              className="col-span-3"
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manager" className="text-right">
              Manager
            </Label>
            <Input
              id="manager"
              placeholder="Toni Kross"
              className={
                formErrors.manager ? "border-red-300 bg-red-50 col-span-3" : "col-span-3"
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
