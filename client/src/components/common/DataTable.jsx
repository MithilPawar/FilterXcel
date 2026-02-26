import React, { useState, useMemo } from "react";

const DataTable = ({ data = [], pageSize = 20, title = "Data Table" }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data, pageSize]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-600">No data to display.</p>;
  }

  const columnHeaders = Object.keys(data[0]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="w-full mb-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}

      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            {columnHeaders.map((header) => (
              <th key={header} className="px-4 py-3 border-b border-gray-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition-colors`}
            >
              {columnHeaders.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-3 whitespace-nowrap border-b border-gray-100 text-gray-800"
                >
                  {row[col]?.toString() ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-700 rounded-b-xl">
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <div className="space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
