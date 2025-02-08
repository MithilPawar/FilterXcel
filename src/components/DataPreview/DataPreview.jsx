import React from "react";
import { useSelector } from "react-redux"; // Import theme state
import ColumnHeader from "../ColumnHeader/ColumnHeader";

const DataPreview = ({
  data = [],
  handleSort,
  currentPage = 1,
  rowsPerPage = 10,
  sortedColumn,
  sortDirection,
}) => {
  const { theme } = useSelector((state) => state.theme); // Get current theme

  if (!data || data.length === 0) {
    return (
      <p className={`text-center mt-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        No data available
      </p>
    );
  }

  const header = data[0] || [];
  const rows = data.slice(1) || [];

  const startRow = (currentPage - 1) * rowsPerPage;
  const endRow = startRow + rowsPerPage;
  const visibleRows = rows.slice(startRow, endRow);

  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full table-auto mt-4 border-collapse border ${
          theme === "dark" ? "border-gray-600" : "border-gray-300"
        }`}
      >
        <thead>
          <tr
            className={`${
              theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"
            }`}
          >
            {header.map((col, index) => (
              <ColumnHeader
                key={index}
                column={col}
                index={index}
                handleSort={handleSort}
                sortedColumn={sortedColumn}
                sortDirection={sortDirection}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                theme === "dark"
                  ? rowIndex % 2 === 0
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-900 text-gray-300"
                  : rowIndex % 2 === 0
                  ? "bg-white text-gray-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border">
                  {cell || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPreview;
