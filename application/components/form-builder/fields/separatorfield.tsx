"use client";

import { z } from "zod";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../form-elements";
import { Label } from "../../ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../ui/form";
import { Switch } from "@/components/ui/switch";
import { RiSeparator } from "react-icons/ri";
import { Separator } from "../../ui/separator";
import useDesigner from "../hooks/useDesigner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const type: ElementsType = "SeparatorField";

const extraAttributes = {
  managerOnly: false,
};

const propertiesSchema = z.object({
  managerOnly: z.boolean().default(false),
});

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

export const SeparatorFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: {managerOnly: false}
  }),
  designerBtnElement: {
    icon: RiSeparator,
    label: "Separator",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Separator field</Label>
      <Separator />
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return <Separator />;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      managerOnly: false,
    },
  });

  function applyChanges(data: propertiesFormSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        managerOnly: data.managerOnly,
      },
    });
  }

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);
  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="managerOnly"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Manager Only</FormLabel>
                <FormDescription className="text-xs">
                  Visible for manager only
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
