"use client";
import {
  getAppraisalSubmissionByFormId,
  updateAppraisalSubmissionByFormId,
} from "@/actions/appraisal.action";
import { createAppraisalSubmissionByFormId } from "@/actions/appraisalSubmission";
import { cn, convertTextToTitleCase } from "@/lib/utils";
import { Role } from "@prisma/client";
import { DotIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  FormElementInstance,
  FormElements,
} from "../form-builder/form-elements";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import StaffInfoSheet from "@/app/admin/employees/_components/staffInfoSheet";

export default function AppraisalFormSubmit({
  formId,
  content,
  userId,
  userRole,
  employeeData,
  employeeResponseFormId,
}: {
  formId: string;
  content: FormElementInstance[];
  userId: string;
  userRole: Role;
  employeeData?: any;
  employeeResponseFormId?: string;
}) {
  const router = useRouter();
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());

  const [pending, startTransition] = useTransition();

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);
      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }
    return true;
  }, []);

  const submitValue = useCallback(
    (key: string, value: string) => {
      formValues.current[key] = value;
    },
    [content],
  );

  const submitForm = async () => {
    formErrors.current = {};

    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast.error("Please check the form for errors.");
      return;
    }
    try {
      if (userRole === "STAFF") {
        const JsonContent = JSON.stringify(formValues.current);
        const response = await createAppraisalSubmissionByFormId(
          formId,
          userId,
          JsonContent,
          employeeData,
        );

        if (response.status === 201) {
          // DISPLAY SUCCESSFUL SUBMISSION MESSAGE
          toast.success(response.message);
          router.replace("/staff");
        }
      } else if (userRole === "MANAGER" && employeeResponseFormId) {
        const currentResponse = await getAppraisalSubmissionByFormId(
          employeeResponseFormId,
        );

        if (currentResponse.status === 200 && currentResponse.data) {
          const currentResponseContent = JSON.parse(
            currentResponse.data.content,
          );

          const updatedContent = {
            ...currentResponseContent,
            ...formValues.current,
          };

          const payload = {
            content: JSON.stringify(updatedContent),
            hasManagerAppraise: true,
          };

          const response = await updateAppraisalSubmissionByFormId(
            employeeResponseFormId,
            payload,
          );

          if (response.status === 200) {
            // DISPLAY SUCCESSFUL SUBMISSION MESSAGE
            toast.success(response.message);
            router.replace("/staff");
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center space-y-6 bg-accent p-8">
      <div
        className={cn(
          "w-full max-w-3xl space-y-4 rounded-lg bg-white",
          userRole !== "MANAGER" && "hidden",
        )}
      >
        <Card className="w-full max-w-3xl border-none shadow-none">
          <CardHeader>
            <div className="flex flex-col space-y-1">
              <div className="text-2xl font-medium tracking-tight">
                {employeeData.name}
              </div>
              <div className="flex items-center space-x-0.5 text-sm text-muted-foreground">
                <span>
                  {convertTextToTitleCase(employeeData.departmentName) || "N.A"}
                </span>
                <DotIcon size={16} />
                <StaffInfoSheet
                  data={employeeData}
                  className="hover:underline hover:underline-offset-2"
                >
                  View Profile
                </StaffInfoSheet>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div
        key={renderKey}
        className="w-full max-w-3xl space-y-4 rounded-lg bg-white p-4"
      >
        {content
          .filter((element) => {
            if (userRole === "MANAGER") {
              return element.extraAttributes?.managerOnly === true;
            } else if (userRole === "STAFF") {
              return element.extraAttributes?.managerOnly === false;
            }
          }) // Filter out manager only fields
          .map((element) => {
            const FormElement = FormElements[element.type].formComponent;
            return (
              <FormElement
                key={element.id}
                elementInstance={element}
                submitValue={submitValue}
                isInvalid={formErrors.current[element.id]}
                defaultValue={formValues.current[element.id]}
              />
            );
          })}
        <Button
          className="mt-6 w-full"
          disabled={pending}
          onClick={() => {
            submitForm();
          }}
        >
          {!pending ? (
            "Submit"
          ) : (
            <Loader2Icon size={16} className="animate-spin" />
          )}
        </Button>
      </div>
    </div>
  );
}
