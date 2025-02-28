import React, { useState } from "react";
import { useSelector } from "react-redux";
import TableHeader from "../DataTable/TableHeader";
import Pagination from "../common/Pagination"; 

const DataTable = ({ data = [], handleSort, sortedColumn, sortDirection }) => {
  const { theme } = useSelector((state) => state.theme);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!data.length) {
    return (
      <p className={`text-center mt-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        No data available
      </p>
    );
  }

  const headers = Object.keys(data[0]);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;
  const visibleRows = data.slice(startRow, startRow + rowsPerPage);

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full table-auto mt-4 border-collapse border ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
        <thead>
          <tr className={theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}>
            {headers.map((col, index) => (
              <TableHeader
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
            <tr key={rowIndex} className={theme === "dark" ? (rowIndex % 2 === 0 ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-gray-300") : (rowIndex % 2 === 0 ? "bg-white text-gray-800" : "bg-gray-100 text-gray-800")}>
              {Object.values(row).map((cell, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border">{cell || "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Component */}
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
    </div>
  );
};

export default DataTable;
