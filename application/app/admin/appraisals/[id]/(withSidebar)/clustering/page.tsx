import {
  getAppraisalFormById,
  getAppraisalFormSubmissionsByFormId,
} from "@/actions/appraisal.action";
import BarChartComponent from "@/components/charts/bar-chart";
import PieChartComponent from "@/components/charts/pie-chart";
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
  const clusters = await getClusters(payload);


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


  return (
    <>
      <h1>Clustering Results</h1>
      <table>
      <thead>
        <tr className="border border-black">
          {Object.keys(clusters).map((key) => (
            <th key={key} className="border border-black">{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: maxRows }).map((_, rowIndex) => (
          <tr key={rowIndex} className="border border-black">
            {Object.values(clusterNames).map((array, columnIndex) => (
              <td key={columnIndex} className="border border-black">{array[rowIndex]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}
