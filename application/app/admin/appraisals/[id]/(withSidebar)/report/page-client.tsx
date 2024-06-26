import {
  getAppraisalFormById,
  getAppraisalFormSubmissionsByFormId,
} from "@/actions/appraisal.action";
import BarChartComponent from "@/components/charts/bar-chart";
import PieChartComponent from "@/components/charts/pie-chart";
import WordCloudComponent from "@/components/charts/word-cloud";
import {
  analyzeFormResponses,
  getSentiment as getSentimentOriginal,
} from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getSentimentWithRetry(objectWithData: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const sentiment = await getSentimentOriginal(objectWithData);
      if (sentiment && sentiment.sentiments) {
        return sentiment;
      }
    } catch (error) {
      // Wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Sentiment analysis failed");
}

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

  const reportDataPromises = reportDataJson.map(
    async (element: any, index: number) => {
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
        const sentiment = await getSentimentWithRetry(objectWithData);
        if (!sentiment || !sentiment.sentiments) {
          throw new Error("Sentiment analysis failed");
        }
        const payload = { ...element, data: sentiment.sentiments };
        const positiveWords = sentiment.positive_sentences
          ? sentiment.positive_sentences.split(" ")
          : [];
        const negativeWords = sentiment.negative_sentences
          ? sentiment.negative_sentences.split(" ")
          : [];
        const neutralWords = sentiment.neutral_sentences
          ? sentiment.neutral_sentences.split(" ")
          : [];
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
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h2>Positive</h2>
                    <WordCloudComponent words={positiveWords} />
                  </div>
                  <div>
                    <h2>Negative</h2>
                    <WordCloudComponent words={negativeWords} />
                  </div>
                  <div>
                    <h2>Neutral</h2>
                    <WordCloudComponent words={neutralWords} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      } else {
        // Add additional logic or components for other cases
        return null;
      }
    },
  );

  const reportData = await Promise.all(reportDataPromises);

  return (
    <>
      <div className="space-y-6">{reportData}</div>
    </>
  );
}
