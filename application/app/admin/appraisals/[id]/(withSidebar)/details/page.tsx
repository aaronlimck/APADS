import {
  getAppraisalFormById,
  getAppraisalFormSubmissionsByFormId,
} from "@/actions/appraisal.action";
import AppraisalRecipientsTable from "@/components/appraisal/appraisal-recipients-table";
import {
  TotalRecipientsCard,
  TotalSubmissionCard,
  TotalSubmissionRate,
} from "@/components/appraisal/appraisal-stats-card";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import ClusteringBtn from "./_components/clusteringBtn";
import ResponseReportBtn from "./_components/responseReportBtn";

export default async function AdminAppraisalDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const formData = await getAppraisalFormById(id);
  const apprisalSubmissionData = await getAppraisalFormSubmissionsByFormId(id);
  const noOfApprisalSubmission = apprisalSubmissionData.data.length;
  console.log(noOfApprisalSubmission);

  const completedAppraisalSubmissions = formData.data?.appraisalSubmissions;
  type EmployeeStatus = {
    employeeCompleted: boolean;
    managerCompleted: boolean;
  };

  const employeeCompletedManagerAppraisedObject: {
    [employeeId: string]: EmployeeStatus;
  } = {};

  completedAppraisalSubmissions?.map((appraisalSubmission: any) => {
    employeeCompletedManagerAppraisedObject[appraisalSubmission.employeeId] = {
      employeeCompleted: true,
      managerCompleted: appraisalSubmission.hasManagerAppraise,
    };
  });

  if (!formData || !formData.data) {
    throw new Error("Form not found");
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">{formData.data.name}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="font-normal text-muted-foreground hover:text-primary"
          >
            <Link
              className="flex items-center gap-2"
              target="blank"
              href={`/admin/appraisals/${id}/viewer`}
            >
              <ExternalLinkIcon size={16} />
              <span className="font-normal">Appraisal Form</span>
            </Link>
          </Button>

          <ResponseReportBtn
            noOfApprisalSubmission={noOfApprisalSubmission}
            id={id}
          />

          <ClusteringBtn
            noOfApprisalSubmission={noOfApprisalSubmission}
            id={id}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        <TotalRecipientsCard formId={id} />
        <TotalSubmissionCard formId={id} />
        <TotalSubmissionRate formId={id} />
      </div>

      <AppraisalRecipientsTable
        formData={formData.data}
        employeeCompletedManagerAppraisedObject={
          employeeCompletedManagerAppraisedObject
        }
      />
    </div>
  );
}
