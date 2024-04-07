import {
  getAppraisalFormById,
  getAppraisalFormSubmissionsByFormId,
} from "@/actions/appraisal.action";
import { getUserById } from "@/actions/user.action";
import PieChartComponent from "@/components/charts/pie-chart-Importance";
import { analyzeFormResponses, getClusters, getSentiment } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RxQuestionMarkCircled } from "react-icons/rx";

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

  // label encode the form responses and analyze sentiment for clustering
  const mappings: { [key: string]: Map<string, number> } = {};
  for (let i = 0; i < formStructure.length; i++) {
    if (formStructure[i].type == "SelectField") {
      const mapping = new Map();
      for (
        let j = 0;
        j < formStructure[i].extraAttributes.options.length;
        j++
      ) {
        mapping.set(
          formStructure[i].extraAttributes.options[j],
          formStructure[i].extraAttributes.options.length - j,
        );
      }
      mappings[formStructure[i].id] = mapping;
    }
  }

  const empIDs: string[] = [];
  const sentimentPromises = [];

  for (let i = 0; i < formResponses.length; i++) {
    const sentimentAnalysis = Object.keys(formResponses[i]).map(
      async (element: string) => {
        if (element in mappings) {
          formResponses[i][element] = mappings[element].get(
            formResponses[i][element],
          );
        } else {
          try {
            const sentimentResponse = await getSentiment({
              data: formResponses[i][element],
            });
            formResponses[i][element] =
              sentimentResponse.sentiments[0].compound_percentage;
          } catch (error) {
            console.error(`Error getting sentiment for ${element}:`, error);
          }
        }
      },
    );

    sentimentPromises.push(...sentimentAnalysis);

    empIDs.push(submissionsData.data[i].employeeId);
  }

  await Promise.all(sentimentPromises);

  const questionTypes = formStructure.reduce((acc: any, element: any) => {
    acc[element.id] = element.type;
    return acc;
  }, {});

  const payload = {
    empIDs: empIDs,
    formResponses: formResponses,
    questionTypes: questionTypes,
  };

  const clusteringResponse = await getClusters(payload);

  const clusters = clusteringResponse.clusters;

  const maxRows = Math.max(
    ...Object.values(clusters).map((array: any) => array.length),
  );

  // Replace employee ids with employee names in the clusters

  var clusterNames: { [key: number]: string[] } = {};
  await Promise.all(
    Array.from({ length: maxRows }).map(async (_, rowIndex) => {
      await Promise.all(
        Object.values(clusters).map(async (array: any, columnIndex: any) => {
          if (array[rowIndex]) {
            const user = await getUserById(array[rowIndex]);
            if (user) {
              if (clusterNames[columnIndex]) {
                clusterNames[columnIndex].push(user.data!.name);
              } else {
                clusterNames[columnIndex] = [user.data!.name];
              }
            }
          }
        }),
      );
    }),
  );

  // convert cluster labels to human readable form
  const clusterLabels = clusteringResponse.clusterLabels;
  const featureImportance = Object.entries(
    clusteringResponse.featureImportance,
  ).sort((a: any, b: any) => b[1] - a[1]);
  const mostImportantFeatures: any[] = [];
  let totalImportance = 0;
  featureImportance.map((item: any, index) => {
    if (totalImportance < 0.5) {
      mostImportantFeatures.push(item[0]);
      totalImportance += item[1];
    }
  });

  const mostImptFeatPositions: (string | number)[] = [];
  const positions = mostImportantFeatures.map((feature) => {
    const keys = Object.keys(clusteringResponse.featureImportance);
    mostImptFeatPositions.push(keys.indexOf(feature));
  });

  // Create a Map for clusterDescriptions
  const clusterDescriptions = new Map();

  clusteringResponse.clusterCenters.forEach((center: any, centerIndex: any) => {
    clusterDescriptions.set(centerIndex, center[mostImptFeatPositions[0]]);
  });

  // Sort clusterDescriptions in descending order based on its values
  const sortedClusterDescriptions = new Map(
    // @ts-ignore
    [...clusterDescriptions.entries()].sort((a, b) => b[1] - a[1]),
  );

  // Prepare the payload for the PieChartComponent
  const pieChartData = Object.entries(clusteringResponse.featureImportance)
    .sort((a: any, b: any) => b[1] - a[1])
    .map(([feature, importance]) => {
      const formStructureObject = formStructure.find(
        (item: any) => item.id === feature.toString(),
      );
      const label = formStructureObject
        ? formStructureObject.extraAttributes.label
        : feature;
      return { label, value: importance };
    });

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex flex-row gap-2">
          <h1 className="text-2xl font-semibold">Clustering Results</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <RxQuestionMarkCircled
                  className="text-muted-foreground"
                  size={20}
                />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-balance">
                  The clusters are sorted according to the question with the
                  most varied answers in descending order where Employees in
                  Cluster Rank 1 gave the highest/most positive response (if
                  applicable)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <table className="w-full overflow-hidden rounded-lg bg-white text-center shadow">
          <thead className="bg-gray-200">
            <tr>
              {/* @ts-ignore */}
              {[...sortedClusterDescriptions.keys()].map((key, index) => (
                <th key={key} className="px-6 py-4">
                  Cluster Rank {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({
              length: Math.max(
                ...Array.from(
                  sortedClusterDescriptions.keys(),
                  (key: any) => clusterNames[key].length,
                ),
              ),
            }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-gray-100" : ""}
              >
                {/* @ts-ignore */}
                {[...sortedClusterDescriptions.keys()].map((key) => (
                  <td key={key} className="border-t px-6 py-4">
                    {clusterNames[key] && clusterNames[key][rowIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-4 text-2xl font-semibold">Response Variety</p>
        <p className="mb-4">
          The higher the percentage, the more variety in responses for that
          question and the more it influences the cluster categorization.
        </p>

        <div className="mb-8">
          <div className="w-full">
            <PieChartComponent data={pieChartData} />
          </div>

          <table>
            <tbody>
              {Object.entries(clusteringResponse.featureImportance)
                .sort((a: any, b: any) => b[1] - a[1])
                .map(([feature, importance]: any, index) => {
                  const formStructureObject = formStructure.find(
                    (item: any) => item.id === feature.toString(),
                  );
                  const label = formStructureObject
                    ? formStructureObject.extraAttributes.label
                    : feature;
                  return (
                    <tr key={index}>
                      <td className="border-t px-6 py-4">
                        <p className="text-base">
                          {label}:{" "}
                          <span className="font-bold">
                            {(importance * 100).toFixed(2)}%
                          </span>
                        </p>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
