import {
  getAppraisalFormById,
  getAppraisalFormSubmissionsByFormId,
} from "@/actions/appraisal.action";
import BarChartComponent from "@/components/charts/bar-chart";
import PieChartComponent from "@/components/charts/pie-chart-Importance";
import { analyzeFormResponses, getClusters, getSentiment } from "@/lib/utils";
import { get } from "http";
import { ClipboardMinusIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { text } from "stream/consumers";
import {getUserById} from "@/actions/user.action";
import cluster from "cluster";

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
  for (let i=0; i<formStructure.length; i++) {
    if (formStructure[i].type=='SelectField'){
      const mapping = new Map();
      for(let j=0; j<formStructure[i].extraAttributes.options.length; j++){
        mapping.set(formStructure[i].extraAttributes.options[j],formStructure[i].extraAttributes.options.length-j);
      }
      mappings[formStructure[i].id] = mapping;
    }
  }

  const empIDs:string[] = [];
  for (let i=0;i<formResponses.length;i++){
    await Promise.all(Object.keys(formResponses[i]).map(async (element:string) => {
      if (element in mappings){
        formResponses[i][element] = mappings[element].get(formResponses[i][element]);
      }
      else {
        try {
          const sentimentResponse = await getSentiment({data:formResponses[i][element]});
          formResponses[i][element] = sentimentResponse[0].compound_percentage;
        } catch (error) {
          console.error(`Error getting sentiment for ${element}:`, error);
        }
      }
    }));
    empIDs.push(submissionsData.data[i].employeeId);
  }

  const questionTypes = formStructure.reduce((acc: any, element: any) => {
    acc[element.id] = element.type;
    return acc;
  }, {});

  const payload = {'empIDs':empIDs, 'formResponses':formResponses, 'questionTypes':questionTypes};
  const clusteringResponse = await getClusters(payload);
  const clusters = clusteringResponse.clusters;


  const maxRows = Math.max(...Object.values(clusters).map(array => array.length));

  // Replace employee ids with employee names in the clusters

  var clusterNames: { [key: number]: string[] } = {};
  
  await Promise.all(
    Array.from({ length: maxRows }).map(async (_, rowIndex) => {
      await Promise.all(
        Object.values(clusters).map(async (array, columnIndex) => {
          if (array[rowIndex]) {
            const user = await getUserById(array[rowIndex]);
            if (user) {
              if (clusterNames[columnIndex]) {
                clusterNames[columnIndex].push(user.data.name);
              } else {
                clusterNames[columnIndex] = [user.data.name];
              }
            }
          }
        })
      );
    })
  );

  // convert cluster labels to human readable form
  const clusterLabels = clusteringResponse.clusterLabels;
  const featureImportance = Object.entries(clusteringResponse.featureImportance).sort((a, b) => b[1] - a[1]);
  const mostImportantFeatures = [];
  let totalImportance = 0;
  featureImportance.map((item, index) => {
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
  
  clusteringResponse.clusterCenters.forEach((center, centerIndex) => {
    clusterDescriptions.set(centerIndex, center[mostImptFeatPositions[0]]);
  });

  // Sort clusterDescriptions in descending order based on its values
  const sortedClusterDescriptions = new Map([...clusterDescriptions.entries()].sort((a, b) => b[1] - a[1]));

  // Prepare the payload for the PieChartComponent
  const pieChartData = Object.entries(clusteringResponse.featureImportance)
  .sort((a, b) => b[1] - a[1])
  .map(([feature, importance]) => {
    const formStructureObject = formStructure.find(item => item.id === feature.toString());
    const label = formStructureObject ? formStructureObject.extraAttributes.label : feature;
    return { label, value: importance };
  });


  return (
    <>
    <div className="p-10 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Clustering Results</h1>
      <p className="text-lg mb-8">The clusters are sorted according to the question with the most varied answers in descending order where Employees in Cluster Rank 1 gave the highest/most positive response</p>
      <p className="text-lg mb-4">See Response Variety below for more details</p>
      <table className="w-full text-center bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            {[...sortedClusterDescriptions.keys()].map((key, index) => (
              <th key={key} className="py-4 px-6">Cluster Rank {index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(...Array.from(sortedClusterDescriptions.keys(), key => clusterNames[key].length)) }).map((_, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}>
              {[...sortedClusterDescriptions.keys()].map((key) => (
                <td key={key} className="py-4 px-6 border-t">{clusterNames[key] && clusterNames[key][rowIndex]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="p-10 bg-gray-100">
      <p className="text-4xl font-bold mb-4">Response Variety</p>
      <p className="text-lg mb-4">The higher the percentage, the more variety in responses for that question and the more it influences the cluster categorization.</p>
      <div className="mb-8">
        <table>
          <tbody>
          {Object.entries(clusteringResponse.featureImportance)
            .sort((a, b) => b[1] - a[1])
            .map(([feature, importance], index) => {
              const formStructureObject = formStructure.find(item => item.id === feature.toString());
              const label = formStructureObject ? formStructureObject.extraAttributes.label : feature;
              return (
                <tr key={index}>
                  <td className="py-4 px-6 border-t">
                    <p className="text-base">{label}: <span className="font-bold">{(importance * 100).toFixed(2)}%</span></p>
                  </td>
                </tr>
              );
          })}
          </tbody>
        </table>
      </div>
      <div className="w-full h-64">
        <PieChartComponent data={pieChartData} />
      </div>
    </div>
    </>
  );
}
