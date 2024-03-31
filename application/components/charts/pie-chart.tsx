"use client";
import { Chart as ChartJS, registerables } from "chart.js";
// @ts-ignore
import { Pie } from "react-chartjs-2";
import { Card } from "../ui/card";
ChartJS.register(...registerables);

const PieChartComponent = ({ data }: { data: any }) => {
  const generatePieChartData = (response: any) => {
    const { id, type, question, data } = response;
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    for (let i = 0; i < data?.length; i++) {
      if (data[i].compound_percentage > 50) {
        positiveCount++;
      } else if (data[i].compound_percentage < 50) {
        negativeCount++;
      } else {
        neutralCount++;
      }
    }

    return {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [
        {
          label: question,
          data: [positiveCount, neutralCount, negativeCount],
          backgroundColor: [
            "rgba(43, 162, 17, 0.8)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(240, 15, 15, 0.8)",
          ],
          borderColor: [
            "rgb(43, 162, 17)",
            "rgb(255, 159, 64)",
            "rgb(240, 15, 15)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  const pieChartData = generatePieChartData(data);

  return (
    <Card className="p-4">
      <Pie
        data={pieChartData}
        height={300}
        width={500}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
          },
        }}
      />
    </Card>
  );
};
export default PieChartComponent;
