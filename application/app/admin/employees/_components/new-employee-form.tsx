"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import { getDepartment } from "@/actions/department.action";
import { createUser, getAllUsers, updateUserById } from "@/actions/user.action";
import { convertTextToTitleCase } from "@/lib/utils";
import { employeeFormSchema } from "@/schema";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
const ROLES = ["Admin", "Staff"];

export default function EmployeeForm({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const router = useRouter();
  const [departmentNames, setDepartmentNames] = useState<String[]>([]);
  const [staffs, setStaffs] = useState([] as any[]);

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

    const fetchStaff = async () => {
      try {
        const staffData = await getAllUsers();
        const filteredNamesArray = staffData.data
          .filter((staff) => staff.isArchived === false)
          .map((staff) => ({
            id: staff.id,
            name: staff.name,
          }));
        setStaffs(filteredNamesArray);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchDepartments();
    fetchStaff();
  }, [setDepartmentNames, setStaffs]);

  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      departmentName: "",
      managerId: "",
    },
  });

  const handleOnSubmit = async (data: z.infer<typeof employeeFormSchema>) => {
    try {
      const userCreationResponse = await createUser(data);
      if (userCreationResponse && userCreationResponse.status === 409) {
        toast.error(userCreationResponse.error);
      }
      if (userCreationResponse && userCreationResponse.status === 201) {
        toast.success("Staff created successfully");
        router.refresh();
        closeModal();
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

        <FormField
          control={form.control}
          name="managerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800">Manager</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={`${
                      form.formState.errors.managerId?.message &&
                      "border-red-500 focus-visible:ring-red-500"
                    } w-full focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0`}
                  >
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {staffs.map((staff, index) => (
                    <SelectItem key={index} value={staff.id}>
                      {staff.name}
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
