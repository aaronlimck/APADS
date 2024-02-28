"use client";
import { Button } from "../ui/button";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../ui/select";
import { automationSchema } from "@/schema";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { createAutomation } from "@/actions/automation.action";
import { useRouter } from "next/navigation";
import { getAllAppraisalTemplates } from "@/actions/template.action";
import { Template } from "@prisma/client";
import { useEffect } from "react";
import { getDepartment } from "@/actions/department.action";
import { getAllUsersByDepartment } from "@/actions/user.action";

export function CreateAutomationBtn() {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setOpen(!open)} className="font-normal">
        Create Automation
      </Button>
      <AutomationDialog open={open} setOpen={setOpen}></AutomationDialog>
    </>
  );
}

export function AutomationDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Automation</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Fill in the information to create an automation process
        </DialogDescription>
        <AutomationForm onSuccess={() => setOpen(!open)}/>
      </DialogContent>
    </Dialog>
  );
}

export function AutomationForm({ onSuccess }: { onSuccess: () => void }) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState<boolean>(false);
  const router= useRouter();
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [departmentNames, setDepartmentNames] = React.useState<String[]>([]);
  const [isCalendarTwoOpen, setIsCalendarTwoOpen] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesData = await getAllAppraisalTemplates();
        setTemplates(templatesData.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, []);

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

  const form = useForm<z.infer<typeof automationSchema>>({
    resolver: zodResolver(automationSchema),
    defaultValues:{
      name:"",
      templateId:"",
      frequency:"",
      department:"",
      
    }
    
  });

  const handleOnSubmit = async(data:z.infer<typeof automationSchema>) => {
      try{
          //get Department then get recipients
          const recipients = await getAllUsersByDepartment(data.department);
          const recipientArray= recipients.data.map((recipients)=> recipients.id)
          //Creation of Automation process
          const automation= await createAutomation(data,recipientArray);
          if(automation.status===201){
            toast.success("Automation process created succesfully");
            onSuccess()
            router.refresh();
          }
      }catch(error){
        if(error instanceof Error){
          toast("Failed to create new Automation process")
        }
      }

  };

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleOnSubmit)}
        >
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
                    placeholder="Automation Name"
                    className={`${
                      form.formState.errors.name?.message &&
                      "border-red-500 focus-visible:ring-red-500"
                    } w-full focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0`}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="templateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Template</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.templateId?.message &&
                          "border-red-500 focus-visible:ring-red-500",
                        "w-full focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0`",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <SelectValue placeholder="Select a frequency of automation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                        {templates.map((template)=>(
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                  
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={`${
                        form.formState.errors.frequency?.message &&
                        "border-red-500 focus-visible:ring-red-500"
                      } w-full focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0`}
                    >
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="3">EVERY 3 MONTHS</SelectItem>
                    <SelectItem value="6">EVERY 6 MONTHS</SelectItem>
                    <SelectItem value="12">YEARLY</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Recipients</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        form.formState.errors.department?.message &&
                          "border-red-500 focus-visible:ring-red-500",
                        "w-full focus:ring-1 focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-offset-0`",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <SelectValue placeholder="Select Recipients" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                        {departmentNames.map((department,index)=>(
                          <SelectItem key={index} value={department as string}>
                            {department}
                          </SelectItem>
                        ))}
                  
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-800">Start Date</FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal focus-visible:ring-1 focus-visible:ring-offset-0",
                          !field.value && "text-muted-foreground",
                          form.formState.errors.startDate?.message &&
                            "border-red-500 focus-visible:ring-red-500"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(e) => {
                        field.onChange(e);
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs font-normal" />
              </FormItem>
            )}
          />


          
          <Button type="submit" className="w-full">
            Create Automation
          </Button>
        </form>
      </Form>
    </>
  );
}
