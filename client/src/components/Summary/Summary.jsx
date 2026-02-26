import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { generateAISummary } from "../../api";
import DataTable from "../common/DataTable";
import {
  exportSummaryReportToPDF,
  exportSummaryReportToWord,
} from "../../utils/exportSummaryReport";

const Summary = () => {
  const fileData = useSelector((state) => state.file.originalFileData);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportingWord, setExportingWord] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef(null);

  const getMetadata = (data) => {
    const rows = data.length;
    const columns = Object.keys(data[0] || {}).length;
    const columnNames = Object.keys(data[0] || {});
    const sampleData = data.slice(0, 5);
    return { rows, columns, columnNames, sampleData };
  };
  const analyzeColumns = (data) => {
    const totalRows = data.length;
    const columns = [];

    Object.keys(data[0] || {}).forEach((key) => {
      const values = data.map((row) => row[key]);
      const nullCount = values.filter((v) => v === null || v === "").length;
      const uniqueValues = new Set(values.filter(Boolean)).size;

      const sampleValue = values.find((v) => v !== null && v !== undefined);
      const parsedDate = Date.parse(String(sampleValue));
      const type =
        typeof sampleValue === "number"
          ? "Number"
          : typeof sampleValue === "boolean"
          ? "Boolean"
          : sampleValue !== undefined && !Number.isNaN(parsedDate)
          ? "Date"
          : sampleValue === undefined
          ? "Unknown"
          : "String";

      columns.push({
        column: key,
        nulls: totalRows > 0 ? ((nullCount / totalRows) * 100).toFixed(2) : "0.00",
        unique: uniqueValues,
        type,
      });
    });

    return columns;
  };

  const getNumericStats = (data) => {
    const numericCols = [];
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

      numericCols.push({
        column: col,
        min,
        max,
        mean: mean.toFixed(2),
        median,
        std: std.toFixed(2),
      });
    });

    return numericCols;
  };

  const getTopCategories = (data, topN = 3) => {
    const results = [];

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
        results.push({ column: col, values: sorted });
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

  const renderSmartText = (value) => {
    const text = value?.toString().trim();
    if (!text) return null;

    const lines = text
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const explicitBullets = lines
      .filter((line) => /^([-*•]|\d+\.)\s+/.test(line))
      .map((line) => line.replace(/^([-*•]|\d+\.)\s+/, "").trim())
      .filter(Boolean);

    if (explicitBullets.length >= 2) {
      return (
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          {explicitBullets.map((item, idx) => (
            <li key={`${item}-${idx}`}>{item}</li>
          ))}
        </ul>
      );
    }

    const plainText = lines.join(" ");
    const sentences = plainText
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    if (sentences.length >= 4 || plainText.length > 220) {
      return (
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
          {sentences.map((sentence, idx) => (
            <li key={`${sentence}-${idx}`}>{sentence}</li>
          ))}
        </ul>
      );
    }

    return (
      <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
        {text}
      </p>
    );
  };

  const renderSummaryWithoutData = (text) => {
    if (typeof text === "object" && text !== null) {
      return (
        <div className="space-y-5">
          {text.description && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Description</h3>
              {renderSmartText(text.description)}
            </div>
          )}
          {text.insights && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Key Insights</h3>
              {renderSmartText(text.insights)}
            </div>
          )}
          {text.suggestions && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Suggestions</h3>
              {renderSmartText(text.suggestions)}
            </div>
          )}
        </div>
      );
    }

    try {
      const json = JSON.parse(text);
      const filteredSummary = removeLargeDataArrays(json, 5);
      return (
        <div className="overflow-auto max-h-64 p-4 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
          {syntaxHighlight(filteredSummary)}
        </div>
      );
    } catch {
      return renderSmartText(text);
    }
  };

  const metadata = useMemo(() => getMetadata(fileData || []), [fileData]);
  const columnStats = useMemo(() => analyzeColumns(fileData || []), [fileData]);
  const numericStats = useMemo(() => getNumericStats(fileData || []), [fileData]);
  const topCategories = useMemo(() => getTopCategories(fileData || []), [fileData]);

  const reportFileBaseName = useMemo(() => {
    const stamp = new Date().toISOString().slice(0, 10);
    return `summary-report-${stamp}`;
  }, []);

  const hasReportData = metadata.rows > 0;

  const handleExportPDF = () => {
    if (!hasReportData) return;

    exportSummaryReportToPDF(
      {
        metadata,
        columnStats,
        numericStats,
        topCategories,
        summary,
      },
      `${reportFileBaseName}.pdf`
    );

    setShowDownloadMenu(false);
  };

  const handleExportWord = async () => {
    if (!hasReportData || exportingWord) return;

    try {
      setExportingWord(true);
      await exportSummaryReportToWord(
        {
          metadata,
          columnStats,
          numericStats,
          topCategories,
          summary,
        },
        `${reportFileBaseName}.docx`
      );
      setShowDownloadMenu(false);
    } catch (error) {
      console.error("Word export failed", error);
    } finally {
      setExportingWord(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!downloadMenuRef.current?.contains(event.target)) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              AI-Powered Data Summary
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Explore structure, quality, key stats, and generated insights for your uploaded dataset.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleGenerateSummary}
              disabled={loading || !fileData?.length}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate AI Summary"}
            </button>

            <div className="relative" ref={downloadMenuRef}>
              <button
                type="button"
                onClick={() => hasReportData && setShowDownloadMenu((prev) => !prev)}
                disabled={!hasReportData || exportingWord}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportingWord ? "Preparing Word..." : "Download Report ▾"}
              </button>

              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 min-w-[180px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-20 overflow-hidden">
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Download as PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleExportWord}
                    disabled={exportingWord}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Download as Word
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Rows</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{metadata.rows}</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Columns</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{metadata.columns}</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Numeric Columns</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{numericStats.length}</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">Categorical Columns</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{topCategories.length}</p>
          </div>
        </div>
      </div>

      {fileData && fileData.length > 0 ? (
        <DataTable data={fileData} title="Uploaded Data Preview" pageSize={12} />
      ) : (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-700 px-4 py-3 text-sm">
          No data available. Upload and parse a file first to see summary insights.
        </div>
      )}

      {columnStats.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Column Overview</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Column</th>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Type</th>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Null %</th>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Unique</th>
                </tr>
              </thead>
              <tbody>
                {columnStats.map((stat) => (
                  <tr key={stat.column} className="text-gray-700 dark:text-gray-300">
                    <td className="p-2 border border-gray-200 dark:border-gray-700">{stat.column}</td>
                    <td className="p-2 border border-gray-200 dark:border-gray-700">{stat.type}</td>
                    <td className="p-2 border border-gray-200 dark:border-gray-700">{stat.nulls}</td>
                    <td className="p-2 border border-gray-200 dark:border-gray-700">{stat.unique}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {numericStats.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Numeric Column Stats</h3>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Column</th>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Min</th>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Max</th>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Mean</th>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Median</th>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-left">Std Dev</th>
                </tr>
              </thead>
              <tbody>
                {numericStats.map((stat) => (
                  <tr key={stat.column} className="text-gray-700 dark:text-gray-300">
                    <td className="p-2 border border-gray-200 dark:border-gray-700">{stat.column}</td>
                    <td className="p-2 border border-gray-200 dark:border-gray-700">{stat.min}</td>
                    <td className="p-2 border border-gray-200 dark:border-gray-700">{stat.max}</td>
                    <td className="p-2 border border-gray-200 dark:border-gray-700">{stat.mean}</td>
                    <td className="p-2 border border-gray-200 dark:border-gray-700">{stat.median}</td>
                    <td className="p-2 border border-gray-200 dark:border-gray-700">{stat.std}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {topCategories.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Frequent Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topCategories.map((category) => (
              <div
                key={category.column}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded"
              >
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">{category.column}</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                  {category.values.map(([val, count]) => (
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
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-5 min-h-[140px]">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Generated Summary</h3>
          {loading ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">Loading summary...</p>
          ) : (
            renderSummaryWithoutData(summary)
          )}
        </div>
      )}
    </div>
  );
};

export default Summary;
