"use client";
import {
  createAppraisalSubmissionByFormId,
  getAppraisalSubmissionByFormId,
  updateAppraisalSubmissionByFormId,
} from "@/actions/appraisal.action";
import { sendEmail } from "@/actions/email.action";
import { getUserById, getUserManager } from "@/actions/user.action";
import { Role } from "@prisma/client";
import { Loader2Icon } from "lucide-react";
import { useCallback, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  FormElementInstance,
  FormElements,
} from "../form-builder/form-elements";
import { Button } from "../ui/button";

export default function AppraisalFormSubmit({
  formId,
  content,
  userId,
  userRole,
  employeeResponseFormId,
}: {
  formId: string;
  content: FormElementInstance[];
  userId: string;
  userRole: Role;
  employeeResponseFormId?: string;
}) {
  let host = "http://localhost:3000";
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
    [content]
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
          JsonContent
        );

        if (response.status === 201) {
          const employeeResponseFormId = response.data.id;

          const employeeData = await getUserById(userId);
          if (employeeData.status === 200 && employeeData.data) {
            const managerData = await getUserManager(
              employeeData.data?.departmentName
            );
            if (managerData.status === 200 && managerData.data) {
              const managerEmail = managerData.data.email;
              const managerResponseURL = encodeURI(
                `${host}/appraisal/${formId}?employeeResponseFormId=${employeeResponseFormId}`
              );
              await sendEmail(
                managerEmail,
                "Appraisal Form",
                `<a href="${managerResponseURL}">Do appraisal</a>`
              );
            }
          }
          // DISPLAY SUCCESSFUL SUBMISSION MESSAGE
          toast.success(response.message);
        }
      } else if (userRole === "MANAGER" && employeeResponseFormId) {
        const currentResponse = await getAppraisalSubmissionByFormId(
          employeeResponseFormId
        );

        if (currentResponse.status === 200 && currentResponse.data) {
          const currentResponseContent = JSON.parse(
            currentResponse.data.content
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
            payload
          );

          if (response.status === 200) {
            // DISPLAY SUCCESSFUL SUBMISSION MESSAGE
            toast.success(response.message);
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="bg-accent flex flex-col w-full min-h-dvh items-center p-8">
      <div
        key={renderKey}
        className="max-w-3xl w-full bg-white rounded-lg p-4 space-y-4"
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
