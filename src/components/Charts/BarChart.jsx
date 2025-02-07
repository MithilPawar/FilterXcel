import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const BarChart = ({ data, column }) => {
  if (!data || data.length <= 1) return <p>No data available for Bar Chart</p>;

  // Get the column index
  const columnIndex = data[0].indexOf(column);
  if (columnIndex === -1) return <p>Column not found in data</p>;

  // Process the data
  const chartData = data.slice(1).map((row) => {
    const value = row[columnIndex];
    
    // Check for valid numeric values and handle invalid ones
    const numericValue = isNaN(value) || value == null || value === "" ? 0 : parseFloat(value);

    return {
      name: row[0],  // Assuming first column is the name
      value: numericValue,
    };
  }).filter((row) => row.value !== 0);  // Optionally remove rows with zero values

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#0088FE" />
      </ReBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
