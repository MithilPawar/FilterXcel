import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#33AA99",
];

// Helper to check if a column has numeric data
const isNumericColumn = (data, key) => {
  return data.every((item) => !isNaN(Number(item[key])));
};

const ChartComponent = () => {
  const filteredData = useSelector((state) => state.file.filteredFileData);

  const [chartType, setChartType] = useState("line");
  const [xAxisKey, setXAxisKey] = useState("");
  const [yAxisKey, setYAxisKey] = useState("");

  const allKeys = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];

  // Filter keys based on numeric or not
  const numericKeys = allKeys.filter((key) =>
    isNumericColumn(filteredData, key)
  );
  const nonNumericKeys = allKeys.filter(
    (key) => !isNumericColumn(filteredData, key)
  );

  // Reset axis keys when chart type or data keys change
  useEffect(() => {
    if (chartType === "pie") {
      // Pie: X axis = non-numeric (category), Y axis = numeric
      setXAxisKey(nonNumericKeys[0] || allKeys[0] || "");
      setYAxisKey(numericKeys[0] || allKeys[1] || "");
    } else if (chartType === "scatter") {
      // Scatter: both numeric
      setXAxisKey(numericKeys[0] || "");
      setYAxisKey(numericKeys[1] || numericKeys[0] || "");
    } else {
      // Line, Bar, Area: X can be any, Y numeric preferred
      setXAxisKey(allKeys[0] || "");
      setYAxisKey(numericKeys[0] || allKeys[1] || "");
    }
  }, [chartType, filteredData]);

  // Prepare formatted data with numeric conversion for yAxisKey
  const formattedData = filteredData.map((item) => ({
    ...item,
    [yAxisKey]: Number(item[yAxisKey]),
  }));

  // For Scatter, convert xAxisKey also to number
  if (chartType === "scatter") {
    formattedData.forEach((item) => {
      item[xAxisKey] = Number(item[xAxisKey]);
      item[yAxisKey] = Number(item[yAxisKey]);
    });
  }

  // Dropdown options for X and Y axes based on chart type
  const xAxisOptions = chartType === "scatter" ? numericKeys : allKeys;
  const yAxisOptions =
    chartType === "pie"
      ? numericKeys
      : numericKeys.length > 0
      ? numericKeys
      : allKeys;

  return (
    <div className="w-full space-y-6 p-4">
      {/* Chart Type Selector */}
      <div className="flex gap-4 items-center flex-wrap">
        <div>
          <label className="block mb-1 font-medium">Chart Type</label>
          <select
            className="p-2 border rounded"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="area">Area Chart</option>
            <option value="scatter">Scatter Chart</option>
          </select>
        </div>

        {/* X Axis Selector */}
        <div>
          <label className="block mb-1 font-medium">X-Axis</label>
          <select
            className="p-2 border rounded"
            value={xAxisKey}
            onChange={(e) => setXAxisKey(e.target.value)}
          >
            {xAxisOptions.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Y Axis Selector */}
        {chartType !== "pie" && (
          <div>
            <label className="block mb-1 font-medium">Y-Axis</label>
            <select
              className="p-2 border rounded"
              value={yAxisKey}
              onChange={(e) => setYAxisKey(e.target.value)}
            >
              {yAxisOptions.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="w-full h-[500px] border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900">
        {filteredData.length > 0 &&
        xAxisKey &&
        (chartType === "pie" || yAxisKey) ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" && (
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={yAxisKey} stroke="#82ca9d" />
              </LineChart>
            )}

            {chartType === "bar" && (
              <BarChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={yAxisKey} fill="#8884d8" />
              </BarChart>
            )}

            {chartType === "pie" && (
              <PieChart>
                <Pie
                  data={filteredData}
                  dataKey={yAxisKey || allKeys[1]} // default y-axis for pie
                  nameKey={xAxisKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}

            {chartType === "area" && (
              <AreaChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey={yAxisKey}
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            )}

            {chartType === "scatter" && (
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey={xAxisKey} name={xAxisKey} />
                <YAxis type="number" dataKey={yAxisKey} name={yAxisKey} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  name="Data Points"
                  data={formattedData}
                  fill="#8884d8"
                />
              </ScatterChart>
            )}
          </ResponsiveContainer>
        ) : (
          <p className="text-center mt-20 text-gray-500">
            No data available or axes not selected.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
