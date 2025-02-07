import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const LineChart = ({ data, column }) => {
  const chartData = data.slice(1).map((row) => ({
    name: row[0],
    value: parseFloat(row[column]) || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#FF8042" />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
