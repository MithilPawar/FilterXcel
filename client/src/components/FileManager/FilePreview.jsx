import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const FilePreview = () => {
  const navigate = useNavigate();
  const originalFileData = useSelector((state) => state.file.originalFileData);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!originalFileData || originalFileData.length === 0) {
    return <p className="text-gray-500">No file data to display.</p>;
  }

  const headers = Object.keys(originalFileData[0]);

  // Pagination logic
  const totalRows = originalFileData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = originalFileData.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="mt-6 border rounded-lg overflow-x-auto">
      {/* Header Row with Quick Action */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <h3 className="text-lg font-semibold">📄 File Preview</h3>
        <span
          onClick={() => navigate("/summary")}
          className="text-blue-600 cursor-pointer hover:underline text-sm font-medium"
        >
          📊 View Data Summary
        </span>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="p-3 border">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-gray-50">
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="p-3 border">{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center p-3 border-t">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <div className="text-sm">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FilePreview;
