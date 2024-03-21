"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../form-elements";
import useDesigner from "../hooks/useDesigner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const type: ElementsType = "TextField";

const extraAttributes = {
  label: "Type your question",
  required: false,
  managerOnly: false,
  placeholder: "Placeholder",
};

const propertiesSchema = z.object({
  label: z.string().min(1),
  required: z.boolean().default(false),
  managerOnly: z.boolean().default(false),
  placeholder: z.string(),
});

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => {
    return {
      id,
      type,
      extraAttributes,
    };
  },

  designerBtnElement: {
    icon: TextIcon,
    label: "Short",
  },

  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  responseFormComponent: ReponseFormComponent,
  validate: (
    formElement: FormElementInstance,
    currentValue: string,
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }
    return true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, placeholder } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        <span className="ml-1 text-red-800">{required && "*"}</span>
      </Label>
      <Input readOnly disabled placeholder={placeholder} />
    </div>
  );
}

type propertiesFormSchema = z.infer<typeof propertiesSchema>;
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const form = useForm<propertiesFormSchema>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.extraAttributes.label,
      required: element.extraAttributes.required,
      placeholder: element.extraAttributes.placeholder,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  const { updateElement } = useDesigner();
  function applyChanges(data: propertiesFormSchema) {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label: data.label,
        required: data.required,
        managerOnly: data.managerOnly,
        placeholder: data.placeholder,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Placeholder of the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription className="text-xs">
                  Placeholder of the field.
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
        /> */}
      </form>
    </Form>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;

  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  const { label, required, placeholder } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className={cn(error && "text-red-500")}>
        {label}
        <span className="ml-1 text-red-800">{required && "*"}</span>
      </Label>
      <Input
        className={cn(error && "border-red-500")}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return;
          const vaild = TextFieldFormElement.validate(element, e.target.value);
          setError(!vaild);
          if (!vaild) return;
          submitValue(element.id, e.target.value);
        }}
        value={value}
      />
    </div>
  );
}

function ReponseFormComponent({
  elementInstance,
  response,
}: {
  elementInstance: FormElementInstance;
  response: string
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, placeholder } = element.extraAttributes;

  return (
    <div className="flex w-full flex-col gap-2">
      <Label>
        {label}
        <span className="ml-1 text-red-800">{required && "*"}</span>
      </Label>
      <Input
        placeholder={placeholder}
        value={response}
        readOnly
      />
    </div>
  );
}