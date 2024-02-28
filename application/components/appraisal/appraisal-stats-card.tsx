import {
  getAppraisalById,
  getAppraisalFormSubmissionsByFormId,
} from "@/actions/appraisal.action";
import { Card } from "../ui/card";

export const TotalRecipientsCard = async ({ formId }: { formId: string }) => {
  const apprisalData = await getAppraisalById(formId);
  if (!apprisalData) return "0";

  return (
    <Card className="p-4">
      <div className="text-sm text-muted-foreground">Total Recipients</div>
      <div className="text-xl font-semibold">
        {apprisalData.data?.recipientsId.length}
      </div>
    </Card>
  );
};

export const TotalSubmissionCard = async ({ formId }: { formId: string }) => {
  const apprisalSubmissionData = await getAppraisalFormSubmissionsByFormId(
    formId
  );
  if (!apprisalSubmissionData) return "0";

  // COUNT THOSE ONLY WHERE MANAGER HAS APPRISED
  const actualSubmitted = apprisalSubmissionData.data?.filter(
    (apprisalSubmissionData) =>
      apprisalSubmissionData.hasManagerAppraise === true
  ).length;

  return (
    <Card className="p-4">
      <div className="text-sm text-muted-foreground">Total Submission</div>
      <div className="text-xl font-semibold">{actualSubmitted}</div>
    </Card>
  );
};

export const TotalSubmissionRate = () => {
  return (
    <Card className="p-4">
      <div className="text-sm text-muted-foreground">Submission Rate</div>
      <div className="text-xl font-semibold">0%</div>
    </Card>
  );
};
