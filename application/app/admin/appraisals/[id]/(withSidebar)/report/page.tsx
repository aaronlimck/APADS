import {
  getAppraisalFormById,
  getAppraisalFormSubmissionsByFormId,
} from "@/actions/appraisal.action";
import BarChartComponent from "@/components/charts/bar-chart";
import PieChartComponent from "@/components/charts/pie-chart";
import { analyzeFormResponses, getSentiment } from "@/lib/utils";

export default async function AdminAppraisalDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const formData = await getAppraisalFormById(id);
  if (!formData || !formData.data) {
    throw new Error("Form not found");
  }
  const formStructure = JSON.parse(formData.data.content);

  const submissionsData = await getAppraisalFormSubmissionsByFormId(id);
  if (!submissionsData || !submissionsData.data) {
    throw new Error("No responses not found");
  }

  let formResponses = submissionsData.data.map((submission) => {
    return JSON.parse(submission.content);
  });

  const reportDataJson = analyzeFormResponses(formStructure, formResponses);
  return (
    <>
      <h1>Appraisal Report</h1>
      <div className="space-y-6">
        {reportDataJson.map(async (element: any, index: number) => {
          if (element.type === "SelectField") {
            return (
              <div key={element.id}>
                <div className="mb-2 font-medium">{`Q${index + 1}. ${
                  element.question
                }`}</div>
                <BarChartComponent data={element} />
              </div>
            );
          } else if (element.type === "TextAreaField") {
            const objectWithData = {
              data: element.data,
            };
            const sentiment = await getSentiment(objectWithData);
            const payload = { ...element, data: sentiment };
            return (
              <div key={element.id}>
                <div className="mb-2 font-medium">{`Q${index + 1}. ${
                  element.question
                }`}</div>
                <PieChartComponent data={payload} />
              </div>
            );
          } else {
            // Add additional logic or components for other cases
            return null; // or an alternative JSX for other cases
          }
        })}
      </div>
    </>
  );
}
