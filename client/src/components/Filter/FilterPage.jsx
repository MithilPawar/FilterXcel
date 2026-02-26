import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setFilteredFileData } from "../../redux/slices/fileslice";
import DataTable from "../common/DataTable";
import {
  exportToCSV,
  exportToExcel,
  exportToJSON,
} from "../../utils/exportFile";

// Helper function to parse dates in various formats
const parseDate = (dateStr) => {
  const date = new Date(dateStr);
  return isNaN(date) ? null : date;
};

const FilterPage = () => {
  const dispatch = useDispatch();
  const originalData = useSelector((state) => state.file.originalFileData);
  const filteredData = useSelector((state) => state.file.filteredFileData);

  const [selectedFormat, setSelectedFormat] = useState("CSV");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const [filters, setFilters] = useState([
    { column: "", condition: "contains", value: "", logicalOperator: "AND" },
  ]);

  const handleFilterChange = (index, field, newValue) => {
    const updatedFilters = [...filters];
    updatedFilters[index][field] = newValue;
    setFilters(updatedFilters);
  };

  const addFilter = () => {
    setFilters([
      ...filters,
      { column: "", condition: "contains", value: "", logicalOperator: "AND" },
    ]);
  };

  const removeFilter = (index) => {
    const updatedFilters = filters.filter((_, idx) => idx !== index);
    setFilters(updatedFilters);
  };

  const clearAllFilters = () => {
    setFilters([
      { column: "", condition: "contains", value: "", logicalOperator: "AND" },
    ]);
    dispatch(setFilteredFileData(originalData));
  };

  const applyFilters = () => {
    if (!filters.length) {
      dispatch(setFilteredFileData(originalData));
      return;
    }

    let result = [];

    filters.forEach((filter, index) => {
      const { column, condition, value, logicalOperator } = filter;
      if (!column || value === "") return;

      const filterValue = value.toLowerCase();

      const evaluateCondition = (row) => {
        const cellValue = row[column];
        if (cellValue == null) return false;
        const cell = String(cellValue).toLowerCase();

        switch (condition) {
          case "equals":
            return cell === filterValue;
          case "contains":
            return cell.includes(filterValue);
          case "startsWith":
            return cell.startsWith(filterValue);
          case "endsWith":
            return cell.endsWith(filterValue);
          case "greaterThan":
            return !isNaN(cellValue) && +cellValue > +value;
          case "lessThan":
            return !isNaN(cellValue) && +cellValue < +value;
          case "before":
            const beforeDate = parseDate(value);
            const cellDateBefore = parseDate(cellValue);
            return cellDateBefore && beforeDate && cellDateBefore < beforeDate;
          case "after":
            const afterDate = parseDate(value);
            const cellDateAfter = parseDate(cellValue);
            return cellDateAfter && afterDate && cellDateAfter > afterDate;
          case "notEquals":
            return cell !== filterValue;
          case "notContains":
            return !cell.includes(filterValue);
          default:
            return true;
        }
      };

      const currentMatches = originalData.filter(evaluateCondition);

      if (index === 0) {
        result = currentMatches;
      } else if (logicalOperator === "AND") {
        const ids = new Set(currentMatches.map((row) => JSON.stringify(row)));
        result = result.filter((row) => ids.has(JSON.stringify(row)));
      } else if (logicalOperator === "OR") {
        const combined = new Map();
        result.forEach((row) => combined.set(JSON.stringify(row), row));
        currentMatches.forEach((row) => combined.set(JSON.stringify(row), row));
        result = Array.from(combined.values());
      }
    });

    dispatch(setFilteredFileData(result));
  };

  const handleExport = (type) => {
    switch (type) {
      case "csv":
        exportToCSV(filteredData);
        break;
      case "excel":
        exportToExcel(filteredData);
        break;
      case "json":
        exportToJSON(filteredData);
        break;
      default:
        break;
    }
    setShowDownloadOptions(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-6">
        {filters.map((filter, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 items-center">
            <select
              value={filter.column}
              onChange={(e) =>
                handleFilterChange(index, "column", e.target.value)
              }
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Column</option>
              {originalData[0] &&
                Object.keys(originalData[0]).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
            </select>

            <select
              value={filter.condition}
              onChange={(e) =>
                handleFilterChange(index, "condition", e.target.value)
              }
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="contains">Contains</option>
              <option value="equals">Equals</option>
              <option value="greaterThan">Greater Than</option>
              <option value="lessThan">Less Than</option>
              <option value="startsWith">Starts With</option>
              <option value="endsWith">Ends With</option>
              <option value="notEquals">Not Equals</option>
              <option value="notContains">Not Contains</option>
              <option value="before">Before</option>
              <option value="after">After</option>
            </select>

            <select
              value={filter.logicalOperator}
              onChange={(e) =>
                handleFilterChange(index, "logicalOperator", e.target.value)
              }
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>

            {filter.condition === "before" || filter.condition === "after" ? (
              <input
                type="date"
                value={filter.value}
                onChange={(e) =>
                  handleFilterChange(index, "value", e.target.value)
                }
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                type="text"
                placeholder="Enter value..."
                value={filter.value}
                onChange={(e) =>
                  handleFilterChange(index, "value", e.target.value)
                }
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500"
              />
            )}

            {filters.length > 1 && (
              <button
                onClick={() => removeFilter(index)}
                className="bg-red-500 text-white rounded-lg p-3 hover:bg-red-600 transition"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-center gap-6 mt-8">
          {/* Add Filter Button */}
          <button
            onClick={addFilter}
            className="bg-green-500 text-white rounded-lg px-6 py-3 hover:bg-green-600 transition focus:outline-none"
          >
            + Add Filter
          </button>

          {/* Apply Filters Button */}
          <button
            onClick={applyFilters}
            className="bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition focus:outline-none"
          >
            Apply Filters
          </button>

          {/* Clear All Button */}
          <button
            onClick={clearAllFilters}
            className="bg-gray-500 text-white rounded-lg px-6 py-3 hover:bg-gray-600 transition focus:outline-none"
          >
            Clear All
          </button>

          {/* Download Button with Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-100 disabled:cursor-not-allowed"
              disabled={filteredData.length === 0}
              onClick={() => {
                if (filteredData.length === 0) return;
                setShowDownloadOptions((prev) => !prev);
              }}
            >
              <FaDownload />
              Download
            </button>

            {/* Dropdown Options */}
            {showDownloadOptions && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg z-20 w-48">
                <button
                  onClick={() => handleExport("csv")}
                  className="block px-4 py-2 text-sm hover:bg-indigo-100 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={filteredData.length === 0}
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="block px-4 py-2 text-sm hover:bg-indigo-100 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={filteredData.length === 0}
                >
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExport("json")}
                  className="block px-4 py-2 text-sm hover:bg-indigo-100 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={filteredData.length === 0}
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {filters.some((filter) => filter.column && filter.value) && (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Applied Filters
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {filters.map((filter, index) =>
              filter.column && filter.value ? (
                <li key={index} className="text-blue-700">
                  <span className="font-medium">{filter.logicalOperator}:</span>{" "}
                  <strong>{filter.column}</strong> {filter.condition} "
                  <em>{filter.value}</em>"
                </li>
              ) : null
            )}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto mt-8">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg">
            {" "}
            {/* Removed border class */}
            <DataTable
              data={filteredData}
              pageSize={20}
              title="Filtered Results"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
