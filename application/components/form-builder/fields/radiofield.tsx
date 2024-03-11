"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../form-elements";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import { MdOutlineFormatListNumbered } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Switch } from "../../ui/switch";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { toast } from "../../ui/use-toast";

const type: ElementsType = "RadioField";

const extraAttributes = {
  label: "Type your question",
  required: false,
  placeHolder: "Select an option",
  managerOnly: false,
  options: [],
};

const propertiesSchema = z.object({
  label: z.string().min(1),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  options: z.array(z.string()).default([]),
  managerOnly: z.boolean().default(false),
});

export const RadioFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: MdOutlineFormatListNumbered,
    label: "Number Option",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

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
  const { label, required , options} = element.extraAttributes;
  return (
    <div>
      <div className="flex w-full flex-col gap-2">
        <Label className="my-2">
          {label}
          {required && "*"}
        </Label>
      </div>
      <RadioGroup defaultValue="comfortable" className="flex flex-col gap-2">
        {options.length != 0 &&
          options.map((option) => (
            <div className="flex items-center space-x-2" key={option}>
              <RadioGroupItem
                value={option}
                id={option}
                className="text-slate-400"
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
      </RadioGroup>
      {options.length == 0 && (
        <RadioGroup className="flex flex-col gap-2" defaultValue="comfortable">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="LOL" />
            <Label htmlFor="LOL">New number option</Label>
          </div>
        </RadioGroup>
      )}
    </div>
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

  const { label, required, placeHolder, options } = element.extraAttributes;
  return (
    <div className="flex w-full flex-col gap-2 gap-y-4">
      <Label className={cn(error && "text-red-500")}>
        {label}
        {required && "*"}
      </Label>
      <RadioGroup
        className="flex flex-col gap-2"
        defaultValue="comfortable"
        onValueChange={(value) => {
          setValue(value);
          if (!submitValue) return;
          const valid = RadioFieldFormElement.validate(element, value);
          setError(!valid);
          submitValue(element.id, value);
        }}
      >
        {options.length != 0 &&
          options.map((option) => (
            <div className="flex items-center gap-y-2 space-x-2" key={option}>
              <RadioGroupItem
                value={option}
                id={option}
                className="text-slate-400"
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        {options.length == 0 && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="LOL" />
              <Label htmlFor="LOL">New number option</Label>
            </div>
        )}
      </RadioGroup>
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const [count, setCount] = useState(1);
  const element = elementInstance as CustomInstance;
  const { updateElement, setSelectedElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,
      options: element.extraAttributes.options,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, placeHolder, required, options, managerOnly } = values;
    
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        placeHolder,
        required,
        options,
        managerOnly,
      },
    });

    toast({
      title: "Success",
      description: "Properties saved successfully",
    });

    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-6">
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
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the
                field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>The placeholder of the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Number Options</FormLabel>
                <Button
                  variant={"outline"}
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    form.setValue("options", field.value.concat(count + " "));
                    setCount(count + 1);
                  }}
                >
                  <AiOutlinePlus />
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {form.watch("options").map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-1"
                  >
                    <Input
                      disabled
                      className="max-w-15"
                      placeholder=""
                      value={option}
                      onChange={(e) => {
                        field.value[index] = e.target.value;
                        field.onChange(field.value);
                      }}
                    />
                  </div>
                ))}
                {form.watch("options").length > 0 && (
                  <Button
                    variant={"outline"}
                    onClick={(e) => {
                      e.preventDefault();
                      setCount(1);
                      form.setValue("options", []);
                    }}
                  >
                    Reset Counter
                  </Button>
                )}
                {/* <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={(e) => {
                    e.preventDefault();
                    const newOptions = [...field.value];
                    newOptions.splice(index, 1);
                    field.onChange(newOptions);
                  }}
                >
                  Reset Counter
                </Button> */}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
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
        <Separator />
        <Button className="w-full" type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
}
