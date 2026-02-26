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
import { useState, useEffect, useMemo } from "react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#33AA99",
];

const CHART_HELP_TEXT = {
  line: "Best for trend over categories or sequence.",
  bar: "Best for comparing values across categories.",
  pie: "Best for category contribution to total.",
  area: "Best for cumulative trend emphasis.",
  scatter: "Best for checking relationship between two numeric columns.",
};

const MAX_AXIS_LABEL_LENGTH = 24;

const isFiniteNumberValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return Number.isFinite(value);
  const trimmedValue = String(value).trim();
  if (!trimmedValue) return false;
  return Number.isFinite(Number(trimmedValue));
};

const isNumericColumn = (data, key) => {
  let hasAtLeastOneNumeric = false;

  for (const item of data) {
    const value = item?.[key];
    if (value === null || value === undefined || String(value).trim() === "") {
      continue;
    }

    if (!isFiniteNumberValue(value)) {
      return false;
    }
    hasAtLeastOneNumeric = true;
  }

  return hasAtLeastOneNumeric;
};

const getPreferredAxis = (current, options, fallback = "") => {
  if (options.includes(current)) return current;
  return options[0] || fallback;
};

const ChartComponent = () => {
  const filteredData = useSelector((state) => state.file.filteredFileData);
  const originalData = useSelector((state) => state.file.originalFileData);

  const [chartType, setChartType] = useState("line");
  const [xAxisKey, setXAxisKey] = useState("");
  const [yAxisKey, setYAxisKey] = useState("");

  const chartData = useMemo(() => {
    if (filteredData?.length) return filteredData;
    return originalData || [];
  }, [filteredData, originalData]);

  const allKeys = useMemo(
    () => (chartData.length > 0 ? Object.keys(chartData[0]) : []),
    [chartData]
  );

  const numericKeys = useMemo(
    () => allKeys.filter((key) => isNumericColumn(chartData, key)),
    [allKeys, chartData]
  );
  const nonNumericKeys = useMemo(
    () => allKeys.filter((key) => !numericKeys.includes(key)),
    [allKeys, numericKeys]
  );

  useEffect(() => {
    if (chartType === "pie") {
      setXAxisKey((current) =>
        getPreferredAxis(current, nonNumericKeys, allKeys[0] || "")
      );
      setYAxisKey((current) => getPreferredAxis(current, numericKeys));
    } else if (chartType === "scatter") {
      setXAxisKey((current) => getPreferredAxis(current, numericKeys));
      setYAxisKey((current) => {
        if (numericKeys.length === 0) return "";
        if (numericKeys.length === 1) return numericKeys[0];
        if (numericKeys.includes(current) && current !== xAxisKey) return current;
        return numericKeys.find((key) => key !== xAxisKey) || numericKeys[0];
      });
    } else {
      setXAxisKey((current) => getPreferredAxis(current, allKeys));
      setYAxisKey((current) =>
        getPreferredAxis(current, numericKeys, allKeys[1] || "")
      );
    }
  }, [chartType, allKeys, numericKeys, nonNumericKeys, xAxisKey]);

  const seriesData = useMemo(() => {
    if (!chartData.length || !xAxisKey || !yAxisKey) return [];
    return chartData
      .map((item) => ({
        ...item,
        [yAxisKey]: isFiniteNumberValue(item[yAxisKey])
          ? Number(item[yAxisKey])
          : null,
      }))
      .filter((item) => item[yAxisKey] !== null);
  }, [chartData, xAxisKey, yAxisKey]);

  const scatterData = useMemo(() => {
    if (!chartData.length || !xAxisKey || !yAxisKey) return [];
    return chartData
      .map((item) => {
        const xValue = isFiniteNumberValue(item[xAxisKey])
          ? Number(item[xAxisKey])
          : null;
        const yValue = isFiniteNumberValue(item[yAxisKey])
          ? Number(item[yAxisKey])
          : null;
        return {
          ...item,
          [xAxisKey]: xValue,
          [yAxisKey]: yValue,
        };
      })
      .filter((item) => item[xAxisKey] !== null && item[yAxisKey] !== null);
  }, [chartData, xAxisKey, yAxisKey]);

  const pieData = useMemo(() => {
    if (!chartData.length || !xAxisKey || !yAxisKey) return [];

    const groupedValues = chartData.reduce((acc, row) => {
      const category = row?.[xAxisKey];
      const metric = row?.[yAxisKey];
      if (!isFiniteNumberValue(metric)) return acc;

      const key =
        category === null || category === undefined || String(category).trim() === ""
          ? "(Blank)"
          : String(category);
      acc[key] = (acc[key] || 0) + Number(metric);
      return acc;
    }, {});

    const entries = Object.entries(groupedValues)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const maxSegments = 12;
    if (entries.length <= maxSegments) return entries;

    const topEntries = entries.slice(0, maxSegments - 1);
    const otherSum = entries
      .slice(maxSegments - 1)
      .reduce((sum, item) => sum + item.value, 0);

    return [...topEntries, { name: "Others", value: otherSum }];
  }, [chartData, xAxisKey, yAxisKey]);

  const xAxisOptions = chartType === "scatter" ? numericKeys : allKeys;
  const yAxisOptions = numericKeys.length > 0 ? numericKeys : allKeys;

  const getEmptyMessage = () => {
    if (!chartData.length) {
      return "No dataset available. Upload and parse a file first.";
    }

    if (!numericKeys.length) {
      return "No numeric column found in the current dataset for chart metrics.";
    }

    if (chartType === "scatter" && numericKeys.length < 2) {
      return "Scatter chart needs at least two numeric columns.";
    }

    if (!xAxisKey || !yAxisKey) {
      return "Select valid X and Y axes to render the chart.";
    }

    return "No valid rows remain for this axis combination.";
  };

  const numberFormatter = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value.toLocaleString();
    }
    return value;
  };

  const shortenLabel = (value, maxLength = MAX_AXIS_LABEL_LENGTH) => {
    const stringValue = value?.toString?.() ?? "";
    if (stringValue.length <= maxLength) return stringValue;
    return `${stringValue.slice(0, maxLength - 1)}…`;
  };

  const tooltipValueFormatter = (value, name) => [
    numberFormatter(value),
    shortenLabel(name, 28),
  ];

  const shortXAxisName = shortenLabel(xAxisKey);
  const shortYAxisName = shortenLabel(yAxisKey);

  const axisOptionsRenderer = (options, emptyLabel) => {
    if (options.length === 0) {
      return (
        <option value="" disabled>
          {emptyLabel}
        </option>
      );
    }

    return options.map((key) => (
      <option key={key} value={key}>
        {key}
      </option>
    ));
  };

  const canRenderChart =
    chartData.length > 0 &&
    xAxisKey &&
    yAxisKey &&
    ((chartType === "pie" && pieData.length > 0) ||
      (chartType === "scatter" && scatterData.length > 0) ||
      ((chartType === "line" || chartType === "bar" || chartType === "area") &&
        seriesData.length > 0));

  return (
    <div className="w-full space-y-6 p-4">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
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

        <div>
          <label className="block mb-1 font-medium">X-Axis</label>
          <select
            className="p-2 border rounded"
            value={xAxisKey}
            onChange={(e) => setXAxisKey(e.target.value)}
            disabled={xAxisOptions.length === 0}
          >
            {axisOptionsRenderer(xAxisOptions, "No valid X-axis")}
          </select>
        </div>

          <div>
            <label className="block mb-1 font-medium">Y-Axis</label>
            <select
              className="p-2 border rounded"
              value={yAxisKey}
              onChange={(e) => setYAxisKey(e.target.value)}
              disabled={yAxisOptions.length === 0}
            >
                {axisOptionsRenderer(yAxisOptions, "No valid Y-axis")}
            </select>
          </div>
        </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {CHART_HELP_TEXT[chartType]}
          </p>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Showing {chartData.length} rows from {filteredData?.length ? "filtered data" : "uploaded data"}.
        </p>
      </div>

      <div className="w-full h-[500px] border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900">
        {canRenderChart ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" && (
              <LineChart data={seriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={xAxisKey}
                  label={{ value: shortXAxisName, position: "insideBottom", offset: -2 }}
                />
                <YAxis
                  label={{ value: shortYAxisName, angle: -90, position: "insideLeft" }}
                />
                <Tooltip formatter={tooltipValueFormatter} />
                <Line type="monotone" dataKey={yAxisKey} stroke="#82ca9d" />
              </LineChart>
            )}

            {chartType === "bar" && (
              <BarChart data={seriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={xAxisKey}
                  label={{ value: shortXAxisName, position: "insideBottom", offset: -2 }}
                />
                <YAxis
                  label={{ value: shortYAxisName, angle: -90, position: "insideLeft" }}
                />
                <Tooltip formatter={tooltipValueFormatter} />
                <Bar dataKey={yAxisKey} fill="#8884d8" />
              </BarChart>
            )}

            {chartType === "pie" && (
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [numberFormatter(value), shortYAxisName || "Value"]}
                  labelFormatter={(label) => shortenLabel(label, 32)}
                />
              </PieChart>
            )}

            {chartType === "area" && (
              <AreaChart data={seriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={xAxisKey}
                  label={{ value: shortXAxisName, position: "insideBottom", offset: -2 }}
                />
                <YAxis
                  label={{ value: shortYAxisName, angle: -90, position: "insideLeft" }}
                />
                <Tooltip formatter={tooltipValueFormatter} />
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
                <XAxis
                  type="number"
                  dataKey={xAxisKey}
                  name={shortXAxisName}
                  label={{ value: shortXAxisName, position: "insideBottom", offset: -2 }}
                />
                <YAxis
                  type="number"
                  dataKey={yAxisKey}
                  name={shortYAxisName}
                  label={{ value: shortYAxisName, angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={tooltipValueFormatter}
                />
                <Scatter name="Data Points" data={scatterData} fill="#8884d8" />
              </ScatterChart>
            )}
          </ResponsiveContainer>
        ) : (
          <p className="text-center mt-20 text-gray-500">
            {getEmptyMessage()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
