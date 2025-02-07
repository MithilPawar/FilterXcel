import { PieChart as RechartsPieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF2", "#F45B69"];

const PieChart = ({ data, column }) => {
  if (!data || data.length < 2) return <p>No data available for Pie Chart</p>;

  let chartData = [];

  if (Array.isArray(data[0])) {
    const columnIndex = data[0].indexOf(column);
    if (columnIndex === -1) return <p>Column not found in data</p>;

    const valueCounts = {};
    for (let i = 1; i < data.length; i++) {
      const value = data[i][columnIndex];
      // Skip empty, null, or undefined values
      if (value == null || value === "") continue;

      valueCounts[value] = (valueCounts[value] || 0) + 1;
    }

    chartData = Object.keys(valueCounts).map((key, index) => ({
      name: key,
      value: valueCounts[key],
      color: COLORS[index % COLORS.length]
    }));
  } else if (typeof data[0] === "object") {
    const valueCounts = {};
    data.forEach((row) => {
      const value = row[column];
      // Skip empty, null, or undefined values
      if (value == null || value === "") return;

      valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    chartData = Object.keys(valueCounts).map((key, index) => ({
      name: key,
      value: valueCounts[key],
      color: COLORS[index % COLORS.length]
    }));
  }

  return (
    <RechartsPieChart width={400} height={400}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
    </RechartsPieChart>
  );
};

export default PieChart;
