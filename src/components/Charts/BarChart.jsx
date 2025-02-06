import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, column }) => {
  // Prepare the chart data
  const chartData = {
    labels: data.map((_, index) => `Row ${index + 1}`), // X-axis labels are row numbers
    datasets: [
      {
        label: column, // The column header is used as the label for the dataset
        data: data.map((row) => row[column]), // Y-axis values are from the selected column
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color
        borderColor: 'rgba(75, 192, 192, 1)', // Bar border color
        borderWidth: 1, // Bar border width
      },
    ],
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{`Bar Chart for ${column}`}</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
