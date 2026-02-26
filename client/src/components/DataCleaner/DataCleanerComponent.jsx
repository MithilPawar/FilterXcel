import React, { useState } from "react";
import {
  trimWhitespace,
  changeCase,
  removeDuplicates,
  fillMissingValues,
  dropRowsWithNulls,
  dropColumnsWithNulls,
  replaceValueInColumn,
  findNonNumericCells,
  findInvalidDates,
} from "./cleaningUtils";
import { useSelector, useDispatch } from "react-redux";
import { setFilteredFileData } from "../../redux/slices/fileslice";
import DataTable from "../common/DataTable";
import { Undo2, Trash2, Search, TextCursorInput } from "lucide-react";

const ActionButton = ({
  onClick,
  label,
  icon: Icon,
  title,
  disabled = false,
}) => (
  <button
    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg shadow-sm transition duration-150 ${
      disabled
        ? "bg-gray-400 text-gray-100 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-600 text-white"
    }`}
    onClick={onClick}
    title={title}
    disabled={disabled}
  >
    {Icon && <Icon size={16} />}
    {label}
  </button>
);

const actionLabels = {
  trim: "Trim whitespace",
  uppercase: "Convert to UPPERCASE",
  lowercase: "Convert to lowercase",
  titlecase: "Convert to Title Case",
  removeDuplicates: "Remove duplicate rows",
  fillMissing: "Fill missing values",
  dropRowsWithNulls: "Drop rows with null/empty values",
  dropColumnsWithNulls: "Drop empty columns",
  replaceValue: "Replace values in a column",
};

const DataCleanerComponent = () => {
  const dispatch = useDispatch();
  const currentData = useSelector((state) => state.file.filteredFileData);

  const [historyStack, setHistoryStack] = useState([]);
  const [cleaningHistory, setCleaningHistory] = useState([]);
  const [invalidCells, setInvalidCells] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [fillValue, setFillValue] = useState("");
  const [replaceColumn, setReplaceColumn] = useState("");
  const [replaceFrom, setReplaceFrom] = useState("");
  const [replaceTo, setReplaceTo] = useState("");
  const [status, setStatus] = useState(null);
  const columnNames = currentData[0] ? Object.keys(currentData[0]) : [];
  const hasData = currentData.length > 0;
  const selectedColumnCount = selectedColumns.length;

  const applyCleaning = (action, value = null) => {
    if (!hasData) {
      setStatus({ type: "warning", message: "Upload data before applying cleaning actions." });
      return;
    }

    // Push a deep copy of current data to history stack for Undo
    setHistoryStack((prev) => [
      ...prev,
      JSON.parse(JSON.stringify(currentData)),
    ]);

    // Make a deep clone to avoid reference issues
    let cleaned = JSON.parse(JSON.stringify(currentData));

    switch (action) {
      case "trim":
        cleaned = trimWhitespace(cleaned, selectedColumns);
        break;
      case "uppercase":
      case "lowercase":
      case "titlecase":
        cleaned = changeCase(
          cleaned,
          action === "uppercase"
            ? "upper"
            : action === "lowercase"
            ? "lower"
            : "title",
          selectedColumns
        );
        break;
      case "removeDuplicates":
        cleaned = removeDuplicates(cleaned);
        break;
      case "fillMissing":
        cleaned = fillMissingValues(cleaned, value, selectedColumns);
        break;
      case "dropRowsWithNulls":
        cleaned = dropRowsWithNulls(cleaned);
        break;
      case "dropColumnsWithNulls":
        cleaned = dropColumnsWithNulls(cleaned);
        break;
      case "replaceValue":
        cleaned = replaceValueInColumn(
          cleaned,
          value.column,
          value.from,
          value.to
        );
        break;
      default:
        return;
    }

    const historyLabel = (() => {
      if (action === "fillMissing") {
        return `${actionLabels[action]} (${value === "" ? "empty string" : value})`;
      }
      if (action === "replaceValue") {
        return `${actionLabels[action]} (${value.column}: "${value.from}" → "${value.to}")`;
      }
      return actionLabels[action] || action;
    })();

    dispatch(setFilteredFileData(cleaned));
    setCleaningHistory((prev) => [...prev, historyLabel]);
    setStatus({ type: "success", message: `Action applied: ${historyLabel}` });
  };

  const handleUndo = () => {
    if (historyStack.length === 0) {
      setStatus({ type: "warning", message: "No previous actions to undo." });
      return;
    }

    const previous = [...historyStack];
    const lastState = previous.pop();

    dispatch(setFilteredFileData(lastState));
    setHistoryStack(previous);
    setCleaningHistory((prev) => prev.slice(0, -1));
    setStatus({ type: "success", message: "Last action has been undone." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Data Cleaning Tools
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Clean, validate, and transform your uploaded dataset with column-level control.
        </p>
      </div>

      {status && (
        <div
          className={`rounded-lg p-3 text-sm border flex items-start justify-between gap-3 ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : status.type === "warning"
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <span>{status.message}</span>
          <button
            onClick={() => setStatus(null)}
            className="text-xs underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg border p-3 bg-white dark:bg-gray-800 dark:border-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Rows</p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{currentData.length}</p>
        </div>
        <div className="rounded-lg border p-3 bg-white dark:bg-gray-800 dark:border-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Columns</p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{columnNames.length}</p>
        </div>
        <div className="rounded-lg border p-3 bg-white dark:bg-gray-800 dark:border-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Selected Columns</p>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{selectedColumnCount}</p>
        </div>
      </div>

      <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Select Columns to Clean
          </label>
          <button
            className="text-blue-500 hover:underline text-sm disabled:text-gray-400 disabled:no-underline"
            disabled={!columnNames.length}
            onClick={() =>
              setSelectedColumns(
                selectedColumns.length === columnNames.length ? [] : [...columnNames]
              )
            }
          >
            {selectedColumns.length === columnNames.length ? "Deselect All" : "Select All"}
          </button>
        </div>

        <div className="border rounded-lg p-3 dark:bg-gray-900 dark:text-white max-h-64 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {!columnNames.length && (
              <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full">
                No columns available. Upload and parse a file first.
              </p>
            )}
            {columnNames.map((col) => (
              <label key={col} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={col}
                  checked={selectedColumns.includes(col)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setSelectedColumns((prev) =>
                      isChecked ? [...prev, col] : prev.filter((c) => c !== col)
                    );
                  }}
                  className="rounded text-blue-600 dark:bg-gray-700"
                />
                <span className="text-sm truncate">{col}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
          <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Fill Missing Values
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={fillValue}
              onChange={(e) => setFillValue(e.target.value)}
              placeholder="Value to fill"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!hasData}
              onClick={() => applyCleaning("fillMissing", fillValue)}
            >
              Apply
            </button>
          </div>
        </div>

        <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
          <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
            Replace Value in Column
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <select
              value={replaceColumn}
              onChange={(e) => setReplaceColumn(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Column</option>
              {columnNames.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={replaceFrom}
              onChange={(e) => setReplaceFrom(e.target.value)}
              placeholder="From"
              className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="text"
              value={replaceTo}
              onChange={(e) => setReplaceTo(e.target.value)}
              placeholder="To"
              className="px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!hasData}
            onClick={() => {
              if (!replaceColumn) {
                setStatus({ type: "warning", message: "Select a column before replacing values." });
                return;
              }
              applyCleaning("replaceValue", {
                column: replaceColumn,
                from: replaceFrom,
                to: replaceTo,
              });
            }}
          >
            Apply
          </button>
        </div>
      </div>

      <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 dark:border-gray-700 space-y-3">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ActionButton
          label="Trim Whitespace"
          icon={TextCursorInput}
          onClick={() => applyCleaning("trim")}
          disabled={!hasData}
        />
        <ActionButton
          label="UPPERCASE"
          onClick={() => applyCleaning("uppercase")}
          disabled={!hasData}
        />
        <ActionButton
          label="lowercase"
          onClick={() => applyCleaning("lowercase")}
          disabled={!hasData}
        />
        <ActionButton
          label="Title Case"
          onClick={() => applyCleaning("titlecase")}
          disabled={!hasData}
        />
        <ActionButton
          label="Remove Duplicates"
          icon={Trash2}
          onClick={() => applyCleaning("removeDuplicates")}
          disabled={!hasData}
        />
        <ActionButton
          label="Drop Rows with Nulls"
          onClick={() => applyCleaning("dropRowsWithNulls")}
          disabled={!hasData}
        />
        <ActionButton
          label="Drop Columns with Nulls"
          onClick={() => applyCleaning("dropColumnsWithNulls")}
          disabled={!hasData}
        />
        <ActionButton
          label="Validate Numerics"
          icon={Search}
          disabled={!hasData}
          onClick={() => {
            const result = findNonNumericCells(currentData);
            setInvalidCells(result);
            setStatus({
              type: result.length === 0 ? "success" : "warning",
              message:
                result.length === 0
                  ? "All numeric values are valid."
                  : `Found ${result.length} non-numeric cell(s).`,
            });
          }}
        />
        <ActionButton
          label="Validate Dates"
          icon={Search}
          disabled={!hasData}
          onClick={() => {
            const result = findInvalidDates(currentData);
            setInvalidCells(result);
            setStatus({
              type: result.length === 0 ? "success" : "warning",
              message:
                result.length === 0
                  ? "All dates are valid."
                  : `Found ${result.length} invalid date value(s).`,
            });
          }}
        />
        <ActionButton label="Undo" icon={Undo2} onClick={handleUndo} disabled={!historyStack.length} />
        </div>
      </div>

      <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          📝 Cleaning History
        </h3>
        {cleaningHistory.length === 0 ? (
          <p className="text-sm text-gray-500">No actions performed yet.</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 max-h-48 overflow-auto pr-1">
            {cleaningHistory.map((item, index) => (
              <li key={index} className="flex gap-2 items-start">
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mt-0.5">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
        {invalidCells.length > 0 && (
          <p className="mb-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
            Showing {invalidCells.length} highlighted invalid cell(s) in preview.
          </p>
        )}
        <DataTable
          data={currentData}
          pageSize={20}
          title="🧾 Cleaned Data Preview"
          invalidCells={invalidCells}
        />
      </div>
    </div>
  );
};

export default DataCleanerComponent;
