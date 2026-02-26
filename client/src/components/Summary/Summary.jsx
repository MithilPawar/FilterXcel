import React, { useState } from "react";
import { useSelector } from "react-redux";
import { generateAISummary } from "../../api";
import DataTable from "../common/DataTable"; // ✅ Reusable component

const Summary = () => {
  const fileData = useSelector((state) => state.file.originalFileData);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const getMetadata = (data) => {
    const rows = data.length;
    const columns = Object.keys(data[0] || {}).length;
    const columnNames = Object.keys(data[0] || {});
    const sampleData = data.slice(0, 5);
    return { rows, columns, columnNames, sampleData };
  };
  // Helper: Get column-wise null percentage, data types, and unique values
  const analyzeColumns = (data) => {
    const totalRows = data.length;
    const columns = {};

    Object.keys(data[0] || {}).forEach((key) => {
      const values = data.map((row) => row[key]);
      const nullCount = values.filter((v) => v === null || v === "").length;
      const uniqueValues = new Set(values.filter(Boolean)).size;

      const sampleValue = values.find((v) => v !== null && v !== undefined);
      const type =
        typeof sampleValue === "number"
          ? "Number"
          : typeof sampleValue === "boolean"
          ? "Boolean"
          : Date.parse(sampleValue) && !isNaN(new Date(sampleValue))
          ? "Date"
          : "String";

      columns[key] = {
        nulls: ((nullCount / totalRows) * 100).toFixed(2),
        unique: uniqueValues,
        type,
      };
    });

    return columns;
  };

  // Helper: Get numeric column statistics
  const getNumericStats = (data) => {
    const numericCols = {};
    const isNumeric = (val) => typeof val === "number" && !isNaN(val);

    Object.keys(data[0] || {}).forEach((col) => {
      const values = data.map((row) => row[col]).filter(isNumeric);
      if (values.length === 0) return;

      const sorted = [...values].sort((a, b) => a - b);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const median = sorted[Math.floor(values.length / 2)];
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const std = Math.sqrt(
        values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length
      );

      numericCols[col] = {
        min,
        max,
        mean: mean.toFixed(2),
        median,
        std: std.toFixed(2),
      };
    });

    return numericCols;
  };

  // Helper: Get top frequent values for categorical columns
  const getTopCategories = (data, topN = 3) => {
    const results = {};

    Object.keys(data[0] || {}).forEach((col) => {
      const values = data.map((row) => row[col]);
      const isNumeric = values.every(
        (v) => typeof v === "number" || v === null
      );

      if (!isNumeric) {
        const freq = {};
        values.forEach((val) => {
          if (val !== null && val !== "") freq[val] = (freq[val] || 0) + 1;
        });

        const sorted = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, topN);
        results[col] = sorted;
      }
    });

    return results;
  };

  const handleGenerateSummary = async () => {
    if (!fileData || fileData.length === 0) {
      setSummary("❌ No data available to summarize.");
      return;
    }

    setLoading(true);
    const metadata = getMetadata(fileData);

    try {
      const res = await generateAISummary(metadata);
      setSummary(res.summary);
    } catch (err) {
      console.error("Summary fetch failed", err);
      setSummary("❌ Failed to fetch summary.");
    } finally {
      setLoading(false);
    }
  };

  const syntaxHighlight = (json) => {
    if (typeof json !== "string") {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return json.split("\n").map((line, idx) => {
      const keyMatch = line.match(/^(\s*)"([^"]+)":\s?/);
      const stringMatch = line.match(/: "([^"]*)"/);
      const numberMatch = line.match(/: (\d+(\.\d+)?)/);
      const booleanMatch = line.match(/: (true|false)/);
      const nullMatch = line.match(/: null/);

      return (
        <div key={idx} style={{ fontFamily: "monospace" }}>
          {keyMatch && (
            <>
              <span style={{ color: "#d73a49" }}>{keyMatch[1]}</span>
              <span style={{ color: "#6f42c1" }}>"{keyMatch[2]}"</span>
              <span style={{ color: "#333" }}>: </span>
              {stringMatch ? (
                <span style={{ color: "#032f62" }}>"{stringMatch[1]}"</span>
              ) : numberMatch ? (
                <span style={{ color: "#005cc5" }}>{numberMatch[1]}</span>
              ) : booleanMatch ? (
                <span style={{ color: "#d73a49" }}>{booleanMatch[1]}</span>
              ) : nullMatch ? (
                <span style={{ color: "#6a737d" }}>null</span>
              ) : (
                line.substring(keyMatch[0].length)
              )}
            </>
          )}
          {!keyMatch && <span>{line}</span>}
        </div>
      );
    });
  };

  const removeLargeDataArrays = (obj, threshold = 5) => {
    if (Array.isArray(obj)) {
      if (
        obj.length > threshold &&
        obj.every((item) => typeof item === "object")
      ) {
        return undefined;
      }
      return obj
        .map((item) =>
          typeof item === "object"
            ? removeLargeDataArrays(item, threshold)
            : item
        )
        .filter((item) => item !== undefined);
    } else if (typeof obj === "object" && obj !== null) {
      const newObj = {};
      for (const key in obj) {
        const cleanedValue = removeLargeDataArrays(obj[key], threshold);
        if (cleanedValue !== undefined) {
          newObj[key] = cleanedValue;
        }
      }
      return newObj;
    }
    return obj;
  };

  const renderSummaryWithoutData = (text) => {
    if (typeof text === "object" && text !== null) {
      return (
        <div className="space-y-4">
          {text.description && (
            <div>
              <h3 className="font-semibold">📝 Description:</h3>
              <p className="whitespace-pre-wrap">{text.description}</p>
            </div>
          )}
          {text.insights && (
            <div>
              <h3 className="font-semibold">🔍 Key Insights:</h3>
              <p className="whitespace-pre-wrap">{text.insights}</p>
            </div>
          )}
          {text.suggestions && (
            <div>
              <h3 className="font-semibold">💡 Suggestions:</h3>
              <p className="whitespace-pre-wrap">{text.suggestions}</p>
            </div>
          )}
        </div>
      );
    }

    try {
      const json = JSON.parse(text);
      const filteredSummary = removeLargeDataArrays(json, 5);
      return (
        <div className="overflow-auto max-h-64 p-4 bg-white rounded border border-gray-300">
          {syntaxHighlight(filteredSummary)}
        </div>
      );
    } catch {
      return text
        ?.toString()
        .split("\n")
        .map((line, idx) => (
          <p key={idx} className="mb-2 whitespace-pre-wrap">
            {line}
          </p>
        ));
    }
  };

  const columnStats = analyzeColumns(fileData || []);
  const numericStats = getNumericStats(fileData || []);
  const topCategories = getTopCategories(fileData || []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        📄 AI-Powered Data Summary
      </h2>

      <button
        onClick={handleGenerateSummary}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate AI Summary"}
      </button>
      {fileData && fileData.length > 0 ? (
        <div className="w-full">
          <DataTable
            data={fileData}
            title="📊 Uploaded Data"
            maxRows={12}
            highlight
          />
        </div>
      ) : (
        <p className="mb-6">No data to display in the table.</p>
      )}
      {Object.keys(columnStats).length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">📌 Column Overview</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border">
              <tbody>
                {Object.entries(columnStats).map(([col, stat]) => (
                  <tr key={col}>
                    <td className="p-2 border">{col}</td>
                    <td className="p-2 border">{stat.type}</td>
                    <td className="p-2 border">{stat.nulls}</td>
                    <td className="p-2 border">{stat.unique}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {Object.keys(numericStats).length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">📈 Numeric Column Stats</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 border">Column</th>
                  <th className="p-2 border">Min</th>
                  <th className="p-2 border">Max</th>
                  <th className="p-2 border">Mean</th>
                  <th className="p-2 border">Median</th>
                  <th className="p-2 border">Std Dev</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(numericStats).map(([col, stat]) => (
                  <tr key={col}>
                    <td className="p-2 border">{col}</td>
                    <td className="p-2 border">{stat.min}</td>
                    <td className="p-2 border">{stat.max}</td>
                    <td className="p-2 border">{stat.mean}</td>
                    <td className="p-2 border">{stat.median}</td>
                    <td className="p-2 border">{stat.std}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {Object.keys(topCategories).length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">🔠 Frequent Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(topCategories).map(([col, values]) => (
              <div key={col} className="bg-white border p-4 rounded shadow">
                <h4 className="font-semibold mb-2">{col}</h4>
                <ul className="list-disc list-inside text-sm">
                  {values.map(([val, count]) => (
                    <li key={val}>
                      {val} — {count} occurrences
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary && (
        <div className="bg-gray-100 p-6 rounded-md min-h-[150px] border border-gray-300">
          {loading ? (
            <p>Loading summary...</p>
          ) : (
            renderSummaryWithoutData(summary)
          )}
        </div>
      )}
    </div>
  );
};

export default Summary;
