import { useState } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PieChart from "./PieChart";

const ChartSelector = ({ data, selectedColumn, setSelectedColumn }) => {
  const [selectedChart, setSelectedChart] = useState("bar");

  // Extract column names based on data format
  let columnNames = [];
  if (Array.isArray(data) && data.length > 0) {
    if (Array.isArray(data[0])) {
      // If data[0] is an array, assume it's a row-based structure where the first row contains headers
      columnNames = data[0];
    } else if (typeof data[0] === "object") {
      // If data[0] is an object, extract keys as column names
      columnNames = Object.keys(data[0]);
    }
  }

  return (
    <div className="mt-6">
      {/* Chart Selection Buttons */}
      <div className="flex mb-4">
        {["bar", "line", "pie"].map((chartType) => (
          <button
            key={chartType}
            className={`px-4 py-2 mx-2 text-white rounded-md ${
              selectedChart === chartType ? "bg-emerald-600" : "bg-gray-400"
            }`}
            onClick={() => setSelectedChart(chartType)}
          >
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
          </button>
        ))}
      </div>

      {/* Column Selector Dropdown */}
      <div className="mb-4">
        <label htmlFor="column-selector" className="block text-lg">
          Select Column:
        </label>
        <select
          id="column-selector"
          className="p-3 border border-gray-300 rounded-lg focus:outline-none w-full"
          onChange={(e) => setSelectedColumn && setSelectedColumn(e.target.value)}
          value={selectedColumn || ""}
        >
          <option value="">Select a Column</option>
          {columnNames.map((col, index) => (
            <option key={index} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Render the Selected Chart */}
      {selectedColumn ? (
        selectedChart === "bar" ? (
          <BarChart data={data} column={selectedColumn} />
        ) : selectedChart === "line" ? (
          <LineChart data={data} column={selectedColumn} />
        ) : (
          <PieChart data={data} column={selectedColumn} />
        )
      ) : (
        <p className="text-gray-500">Please select a column to visualize the data.</p>
      )}
    </div>
  );
};

export default ChartSelector;
