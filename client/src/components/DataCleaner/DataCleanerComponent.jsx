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
import { Undo2, Trash2, Type, Search, TextCursorInput } from "lucide-react";

const ActionButton = ({ onClick, label, icon: Icon, title }) => (
  <button
    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-sm transition duration-150"
    onClick={onClick}
    title={title}
  >
    {Icon && <Icon size={16} />}
    {label}
  </button>
);

const DataCleanerComponent = () => {
  const dispatch = useDispatch();
  const currentData = useSelector((state) => state.file.filteredFileData);

  const [historyStack, setHistoryStack] = useState([]);
  const [cleaningHistory, setCleaningHistory] = useState([]);
  const [invalidCells, setInvalidCells] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const columnNames = currentData[0] ? Object.keys(currentData[0]) : [];

  const applyCleaning = (action, value = null) => {
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

    dispatch(setFilteredFileData(cleaned));
    setCleaningHistory((prev) => [...prev, action]);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) {
      alert("No previous actions to undo.");
      return;
    }

    const previous = [...historyStack];
    const lastState = previous.pop();

    dispatch(setFilteredFileData(lastState));
    setHistoryStack(previous);
    setCleaningHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        Data Cleaning Tools
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Columns to Clean:
        </label>
        <div className="border rounded-lg p-3 dark:bg-gray-800 dark:text-white max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Columns:</span>
            <button
              className="text-blue-500 hover:underline text-sm"
              onClick={() =>
                setSelectedColumns(
                  selectedColumns.length === columnNames.length
                    ? []
                    : [...columnNames]
                )
              }
            >
              {selectedColumns.length === columnNames.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <ActionButton
          label="Trim Whitespace"
          icon={TextCursorInput}
          onClick={() => applyCleaning("trim")}
        />
        <ActionButton
          label="UPPERCASE"
          onClick={() => applyCleaning("uppercase")}
        />
        <ActionButton
          label="lowercase"
          onClick={() => applyCleaning("lowercase")}
        />
        <ActionButton
          label="Title Case"
          onClick={() => applyCleaning("titlecase")}
        />
        <ActionButton
          label="Remove Duplicates"
          icon={Trash2}
          onClick={() => applyCleaning("removeDuplicates")}
        />
        <ActionButton
          label="Fill Missing Values"
          onClick={() => {
            const value = prompt("Enter value to fill in missing cells:");
            if (value !== null) applyCleaning("fillMissing", value);
          }}
        />
        <ActionButton
          label="Drop Rows with Nulls"
          onClick={() => applyCleaning("dropRowsWithNulls")}
        />
        <ActionButton
          label="Drop Columns with Nulls"
          onClick={() => applyCleaning("dropColumnsWithNulls")}
        />
        <ActionButton
          label="Replace Value in Column"
          onClick={() => {
            const column = prompt("Column name:");
            const from = prompt("Value to replace:");
            const to = prompt("New value:");
            if (column && from !== null && to !== null)
              applyCleaning("replaceValue", { column, from, to });
          }}
        />
        <ActionButton
          label="Validate Numerics"
          icon={Search}
          onClick={() => {
            const result = findNonNumericCells(currentData);
            setInvalidCells(result);
            alert(
              result.length === 0
                ? "All numeric values are valid ✅"
                : "Found non-numeric cells ❗"
            );
          }}
        />
        <ActionButton
          label="Validate Dates"
          icon={Search}
          onClick={() => {
            const result = findInvalidDates(currentData);
            setInvalidCells(result);
            alert(
              result.length === 0
                ? "All dates are valid ✅"
                : "Found invalid dates ❗"
            );
          }}
        />
        <ActionButton label="Undo" icon={Undo2} onClick={handleUndo} />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          📝 Cleaning History
        </h3>
        {cleaningHistory.length === 0 ? (
          <p className="text-sm text-gray-500">No actions performed yet.</p>
        ) : (
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
            {cleaningHistory.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
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
