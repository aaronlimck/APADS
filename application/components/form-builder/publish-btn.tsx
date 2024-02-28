import { Loader2Icon, PartyPopperIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { publishAppraisalForm } from "@/actions/appraisal.action";
import { useRouter } from "next/navigation";
import { getDepartment } from "@/actions/department.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { convertTextToTitleCase } from "@/lib/utils";
import { getAllUsersByDepartment } from "@/actions/user.action";
import useDesigner from "./hooks/useDesigner";
import { sendEmail } from "@/actions/email.action";

export default function PublishBtn({ id }: { id: string }) {
  let host = "http://localhost:3000";
  const router = useRouter();
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);

  const [departmentNames, setDepartmentNames] = useState<String[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<String>("");
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

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  async function publishForm() {
    // GET FORM CONTENT
    const JsonElements = JSON.stringify(elements);

    if (JsonElements === "[]") {
      toast.error("Form is empty");
      return;
    }

    try {
      // FETCH RECIPIENTS BY DEPARTMENT
      const recipientsData = await getAllUsersByDepartment(
        selectedDepartment as string
      );
      if (recipientsData.status === 200) {
        const recipientsId = recipientsData.data
          .filter((user) => user.role === "STAFF")
          .map((user) => user.id);

        const payload = {
          id,
          recipientsId,
          content: JsonElements,
        };

        // PUBLISH FORM
        const response = await publishAppraisalForm(payload);
        if (response && response.status === 200) {
          toast.success(response.message);
          router.push(`/admin/appraisals/${response.data.id}/details`);
          router.refresh();
        }

        const recipientsEmail = recipientsData.data
          .filter((user) => user.role === "STAFF")
          .map((user) => user.email);

        for (const email of recipientsEmail) {
          sendEmail(
            email,
            "Appraisal Form",
            `<a href="${host}/appraisal/${response.data.id}">Do appraisal</a>`
          );
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm" className="flex gap-2">
          <PartyPopperIcon size={16} />
          <span>Publish</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        {JSON.stringify(elements) === "[]" ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Empty form</AlertDialogTitle>
              <AlertDialogDescription>
                Oops! It seems like your content builder is empty. You cannot
                publish an empty form.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-black text-white">
                Okay
              </AlertDialogCancel>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            {currentStep === 0 && (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>Select recipients</AlertDialogTitle>
                  <AlertDialogDescription>
                    Select recipients to receive a self-evaluation email
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Select
                  defaultValue={selectedDepartment as string}
                  onValueChange={(value) => setSelectedDepartment(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>

                  <SelectContent>
                    {departmentNames.map((role, index) => (
                      <SelectItem key={index} value={role.toUpperCase()}>
                        {convertTextToTitleCase(role as string)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setCurrentStep(0); // Reset to step 0
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>

                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </AlertDialogFooter>
              </>
            )}

            {currentStep === 1 && (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="flex flex-col space-y-3">
                    <span>
                      This action cannot be undone. After publishing you will
                      not be able to edit this form.
                    </span>
                    <span>
                      By publishing this form, you will be able to collect
                      submission.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <div className="flex justify-between w-full">
                    <Button
                      type="button"
                      variant="ghost"
                      className="hover:bg-transparent px-0 text-muted-foreground hover:text-primary"
                      onClick={previousStep}
                    >
                      Back
                    </Button>

                    <div className="flex gap-2">
                      <AlertDialogCancel
                        onClick={() => {
                          setCurrentStep(0); // Reset to step 0
                        }}
                      >
                        Cancel
                      </AlertDialogCancel>

                      <AlertDialogAction
                        disabled={loading}
                        onClick={(e) => {
                          e.preventDefault();
                          startTransition(publishForm);
                        }}
                      >
                        Proceed{" "}
                        {loading && (
                          <Loader2Icon size={16} className="animate-spin" />
                        )}
                      </AlertDialogAction>
                    </div>
                  </div>
                </AlertDialogFooter>
              </>
            )}
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
