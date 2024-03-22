import {
  getAppraisalFormById,
  getAppraisalFormSubmissionsByFormId,
} from "@/actions/appraisal.action";
import BarChartComponent from "@/components/charts/bar-chart";
import PieChartComponent from "@/components/charts/pie-chart";
import { analyzeFormResponses, getSentiment } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AppraisalReportClientPage({
  id,
}: {
  id: string;
}) {
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
            const payload = { ...element, data: sentiment.sentiments };
            return (
              <div key={element.id}>
                <div className="mb-2 font-medium">{`Q${index + 1}. ${
                  element.question
                }`}</div>
                <Tabs defaultValue="pie-chart">
                  <TabsList>
                    <TabsTrigger value="pie-chart">Pie Chart</TabsTrigger>
                    <TabsTrigger value="word-cloud">Word Cloud</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pie-chart">
                    <PieChartComponent data={payload} />
                  </TabsContent>
                  <TabsContent value="word-cloud">
                    Word Cloud {element.id}
                  </TabsContent>
                </Tabs>
              </div>
            );
          } else {
            // Add additional logic or components for other cases
            return null;
          }
        })}
      </div>
    </>
  );
}
