import { publishAppraisalFormByDepartments } from "@/actions/appraisal.action";
import { getDepartment } from "@/actions/department.action";
import { convertTextToTitleCase } from "@/lib/utils";
import { Loader2Icon, PartyPopperIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
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
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import useDesigner from "./hooks/useDesigner";

export default function PublishBtn({ id }: { id: string }) {
  const router = useRouter();
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);

  const [departmentNames, setDepartmentNames] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);

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

  const handleSelectDepartment = (departmentName: string) => {
    // Check if the department is already selected
    const isSelected = selectedDepartment.includes(departmentName);
    // If it's selected, remove it from the list; otherwise, add it
    const updatedDepartments = isSelected
      ? selectedDepartment.filter((item) => item !== departmentName)
      : [...selectedDepartment, departmentName];
    // Update the state with the new list of selected departments
    setSelectedDepartment(updatedDepartments);
  };

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

    const payload = {
      id: id,
      content: JsonElements,
      recipientsDepartment: selectedDepartment,
    };

    try {
      const response = await publishAppraisalFormByDepartments(payload);
      if (response.status === 200) {
        toast.success(response.message);
        router.replace(`/admin/appraisals/${id}/details`);
        router.refresh();
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
                    Please select the departments to whom you&apos;d like to
                    send the self-evaluation form.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {departmentNames.map((departmentName, index) => (
                  <div key={index} className="items-top flex space-x-2">
                    <Checkbox
                      id={departmentName}
                      onCheckedChange={() =>
                        handleSelectDepartment(departmentName)
                      }
                      checked={selectedDepartment.includes(departmentName)}
                    />
                    <Label htmlFor={departmentName} className="font-normal">
                      {convertTextToTitleCase(departmentName)}
                    </Label>
                  </div>
                ))}

                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setCurrentStep(0); // Reset to step 0
                      setSelectedDepartment([]); // Reset selected departments
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
                  <div className="flex w-full justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-0 text-muted-foreground hover:bg-transparent hover:text-primary"
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
