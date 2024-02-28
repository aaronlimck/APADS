"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { getDepartment } from "@/actions/department.action";
import { createUser } from "@/actions/user.action";
import { convertTextToTitleCase } from "@/lib/utils";
import { employeeFormSchema } from "@/schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const ROLES = ["Admin", "Manager", "Staff"];

export default function EmployeeForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const [departmentNames, setDepartmentNames] = useState<String[]>([]);

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
  }, []);

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      departmentName: "",
    },
  });

  const handleOnSubmit = async (data: z.infer<typeof employeeFormSchema>) => {
    // alert(JSON.stringify(data, null, 2));
    try {
      const userCreationResponse = await createUser(data);
      if (userCreationResponse && userCreationResponse.status === 409) {
        toast.error(userCreationResponse.error);
      }
      if (userCreationResponse && userCreationResponse.status === 201) {
        toast.success("Staff created successfully");
        onSuccess();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleOnSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Name"
                  className={`${
                    form.formState.errors.name?.message &&
                    "border-red-500 focus-visible:ring-red-500"
                  } w-full focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0`}
                />
              </FormControl>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Email"
                  className={`${
                    form.formState.errors.email?.message &&
                    "border-red-500 focus-visible:ring-red-500"
                  } w-full focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0`}
                />
              </FormControl>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={`${
                      form.formState.errors.role?.message &&
                      "border-red-500 focus-visible:ring-red-500"
                    } w-full focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0`}
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role.toUpperCase()}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departmentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={`${
                      form.formState.errors.departmentName?.message &&
                      "border-red-500 focus-visible:ring-red-500"
                    } w-full focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0`}
                  >
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departmentNames.map((role, index) => (
                    <SelectItem key={index} value={role.toUpperCase()}>
                      {convertTextToTitleCase(role as string)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Employee
        </Button>
      </form>
    </Form>
  );
}

export function EmployeeFormDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="py-8">
        <DialogHeader>
          <DialogTitle>Create Employee</DialogTitle>
          <DialogDescription>
            Fill in the required details to create a new employee.
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm onSuccess={() => setOpen(!open)} />
      </DialogContent>
    </Dialog>
  );
}

export function AddEmployeeBtn() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        className="font-normal capitalize space-x-2"
        onClick={() => setOpen((current) => !current)}
      >
        <span>New employee</span>
      </Button>
      <EmployeeFormDialog open={open} setOpen={setOpen} />
    </>
  );
}
