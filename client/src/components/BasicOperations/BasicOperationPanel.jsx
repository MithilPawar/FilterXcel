import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaSearch,
  FaTrashAlt,
  FaDownload,
  FaSort,
  FaRegWindowClose,
  FaSyncAlt,
} from "react-icons/fa";
import {
  exportToCSV,
  exportToExcel,
  exportToJSON,
} from "../../utils/exportFile.js";
import {
  sortFilteredData,
  filterBySearchTerm,
  resetFilteredData,
  renameColumn,
  deleteColumn,
  findDuplicates,
  updateCellValue,
} from "../../redux/slices/fileslice.js";

const BasicOperationPanel = () => {
  const dispatch = useDispatch();
  const filteredFileData = useSelector((state) => state.file.filteredFileData);
  const originalFileData = useSelector((state) => state.file.originalFileData);
  const hasDuplicates = useSelector((state) => state.file.hasDuplicates);

  const [isRenaming, setIsRenaming] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const [editingCell, setEditingCell] = useState({
    rowIndex: null,
    columnKey: null,
  });
  const [editValue, setEditValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(filteredFileData.length / rowsPerPage);
  const paginatedData = filteredFileData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (order) => {
    if (selectedColumn) {
      dispatch(sortFilteredData({ column: selectedColumn, order }));
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    dispatch(filterBySearchTerm(term));
  };

  const handleReset = () => {
    setSelectedColumn("");
    setSearchTerm("");
    dispatch(resetFilteredData());
  };

  const handleFindDuplicates = () => {
    if (filteredFileData.length === 0) {
      alert("No data available to check for duplicates.");
      return;
    }
    dispatch(findDuplicates());
  };

  const handleExport = (type) => {
    switch (type) {
      case "csv":
        exportToCSV(filteredFileData);
        break;
      case "excel":
        exportToExcel(filteredFileData);
        break;
      case "json":
        exportToJSON(filteredFileData);
        break;
      default:
        break;
    }
    setShowDownloadOptions(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Sorting & Operations Panel */}
      <div className="flex flex-wrap justify-center gap-4 p-4 bg-indigo-100 text-gray-700 rounded-lg shadow-md w-full max-w-5xl">
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="">Select a Column</option>
          {originalFileData.length > 0 &&
            Object.keys(originalFileData[0]).map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
        </select>

        <button
          onClick={() => handleSort("asc")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md transition"
        >
          <FaSort />
          Sort Asc
        </button>
        <button
          onClick={() => handleSort("desc")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md transition"
        >
          <FaSort />
          Sort Desc
        </button>

        <button
          onClick={() => {
            if (!selectedColumn)
              return alert("Please select a column to rename.");
            setIsRenaming(!isRenaming);
            setNewColumnName("");
          }}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-md transition"
        >
          {isRenaming ? "Cancel Rename" : "Rename"}
        </button>

        {isRenaming && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter new column name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => {
                if (!newColumnName.trim())
                  return alert("New column name cannot be empty.");
                dispatch(
                  renameColumn({
                    oldName: selectedColumn,
                    newName: newColumnName.trim(),
                  })
                );
                setIsRenaming(false);
                setSelectedColumn(newColumnName.trim());
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-md transition"
            >
              Confirm Rename
            </button>
          </div>
        )}

        <button
          disabled={!selectedColumn}
          onClick={() => {
            if (!selectedColumn)
              return alert("Please select a column to delete.");
            const confirmDelete = window.confirm(
              `Are you sure you want to delete the column "${selectedColumn}"?`
            );
            if (confirmDelete) {
              dispatch(deleteColumn(selectedColumn));
              setSelectedColumn("");
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md transition"
        >
          <FaTrashAlt />
          Delete
        </button>

        <button
          onClick={handleFindDuplicates}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-md transition"
        >
          Find Duplicates
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition"
        >
          <FaSyncAlt />
          Reset
        </button>
      </div>

      {/* Search and Download Section */}
      <div className="w-full max-w-5xl px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
          <div className="relative w-80 sm:w-96">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-5 py-3 pl-12 text-base text-gray-700 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
            {searchTerm && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
              >
                <FaRegWindowClose />
              </button>
            )}
          </div>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-md transition disabled:opacity-100 disabled:cursor-not-allowed"
              disabled={filteredFileData.length === 0}
              onClick={() => {
                if (filteredFileData.length === 0) return;
                setShowDownloadOptions((prev) => !prev);
              }}
            >
              <FaDownload />
              Download
            </button>

            {showDownloadOptions && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg z-20 w-40">
                <button
                  onClick={() => handleExport("csv")}
                  className="block px-4 py-2 text-sm hover:bg-indigo-100 w-full text-left"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="block px-4 py-2 text-sm hover:bg-indigo-100 w-full text-left"
                >
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExport("json")}
                  className="block px-4 py-2 text-sm hover:bg-indigo-100 w-full text-left"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto w-full max-w-5xl bg-white border rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              {filteredFileData.length > 0 &&
                Object.keys(filteredFileData[0]).map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                  >
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => {
              const actualRowIndex = (currentPage - 1) * rowsPerPage + rowIndex;
              return (
                <tr key={actualRowIndex} className="hover:bg-gray-50">
                  {Object.entries(row).map(([key, value], colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-2 text-sm text-gray-700"
                      onClick={() => {
                        setEditingCell({
                          rowIndex: actualRowIndex,
                          columnKey: key,
                        });
                        setEditValue(value);
                      }}
                    >
                      {editingCell.rowIndex === actualRowIndex &&
                      editingCell.columnKey === key ? (
                        <input
                          type="text"
                          value={editValue}
                          autoFocus
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => {
                            dispatch(
                              updateCellValue({
                                rowIndex: actualRowIndex,
                                columnKey: key,
                                newValue: editValue,
                              })
                            );
                            setEditingCell({ rowIndex: null, columnKey: null });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              dispatch(
                                updateCellValue({
                                  rowIndex: actualRowIndex,
                                  columnKey: key,
                                  newValue: editValue,
                                })
                              );
                              setEditingCell({
                                rowIndex: null,
                                columnKey: null,
                              });
                            }
                          }}
                          className="w-full px-2 py-1 border border-indigo-300 rounded"
                        />
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-700 text-white text-sm rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-700 text-white text-sm rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {hasDuplicates === false && (
          <div className="p-4 text-center text-green-600 font-semibold">
            No duplicates found.
          </div>
        )}

        {hasDuplicates && filteredFileData.length > 0 && (
          <div className="p-4 text-center text-red-600 font-semibold">
            Found {filteredFileData.length} duplicate rows.
          </div>
        )}

        {filteredFileData.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No data available. Please upload a file first.
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicOperationPanel;
