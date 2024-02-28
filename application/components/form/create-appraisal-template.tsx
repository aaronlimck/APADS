"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { appraisalTemplateSchema, formSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { createAppraisalTemplate } from "@/actions/template.action";

type formSchemaType = z.infer<typeof appraisalTemplateSchema>;

export default function CreateAppraisalTemplate() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center bg-white border font-normal capitalize w-full h-[200px] space-y-2 shadow-sm"
          >
            <FilePlus size={24} className="text-gray-400" />
            <span className="text-muted-foreground">Create Template</span>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-balance">
              Create Template
            </DialogTitle>
          </DialogHeader>
          <CreateForm />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CreateForm() {
  const router = useRouter();
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: formSchemaType) {
    try {
      const response = await createAppraisalTemplate(values);
      if (response.status === 201) {
        toast.success(response.message);
        router.push(
          `/admin/appraisals/${response.data.id}/builder?type=template`
        );
        router.refresh();
      }
    } catch (error: any) {
      toast(
        <div className="flex flex-col">
          <span>Error</span>
          <span>{error.message}</span>
        </div>
      );
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button
            className="w-full"
            onClick={() => {
              form.handleSubmit(onSubmit);
            }}
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting ? "Create" : "Creating..."}
          </Button>
        </form>
      </Form>
    </>
  );
}
