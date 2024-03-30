"use client";
import { Chart as ChartJS, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Card } from "../ui/card";
ChartJS.register(...registerables);

const PieChartComponent = ({ data }: { data: any }) => {
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };
  const generatePieChartData = (response: any) => {
    const { label, value } = response;

    return {
      labels: data.map((item: any) => item.label),
      datasets: [
        {
          data: data.map((item: any) => item.value),
          backgroundColor: data.map(() => generateRandomColor()),
          borderColor: data.map(() => generateRandomColor()),
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
