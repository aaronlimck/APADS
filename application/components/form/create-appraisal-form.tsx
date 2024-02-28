"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

import { createAppraisal } from "@/actions/appraisal.action";
import { formSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type formSchemaType = z.infer<typeof formSchema>;

export default function CreateForm() {
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
      const response = await createAppraisal(values);
      if (response.status === 201) {
        toast(
          <div className="flex flex-col">
            <span>Success</span>
            <span>{response.message}</span>
          </div>,
        );
        router.push(`/admin/appraisals/${response.data.id}/builder`);
        router.refresh();
      }
    } catch (error: any) {
      toast(
        <div className="flex flex-col">
          <span>Error</span>
          <span>{error.message}</span>
        </div>,
      );
    }
  }

  return (
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
  );
}
