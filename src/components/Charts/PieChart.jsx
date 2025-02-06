import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, column }) => {
  const chartData = {
    labels: [...new Set(data.map((row) => row[column]))], // Unique values from the selected column
    datasets: [
      {
        data: [...new Set(data.map((row) => row[column]))].map(
          (label) => data.filter((row) => row[column] === label).length
        ), // Count occurrences of each unique value
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
