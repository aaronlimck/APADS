"use client";
import { Chart as ChartJS, registerables } from "chart.js";
// @ts-ignore
import { Bar } from "react-chartjs-2";
import { Card } from "../ui/card";
ChartJS.register(...registerables);

const BarChartComponent = ({ data }: { data: any }) => {
  const generateBarChartData = (response: any) => {
    const { id, type, question, data } = response;
    const labels = Object.keys(data);
    const chartData = Object.values(data);

    return {
      labels: labels,
      datasets: [
        {
          label: question,
          data: chartData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  const barChartData = generateBarChartData(data);

  return (
    <Card className="p-4">
      <Bar
        data={barChartData}
        height={300}
        width={500}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </Card>
  );
};
export default BarChartComponent;
