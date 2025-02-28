import React from "react";

const TableHeader = ({ column, handleSort, sortedColumn, sortDirection }) => {
  const isSorted = sortedColumn === column;
  const iconRotation = isSorted && sortDirection === "asc" ? "rotate-180" : "rotate-0";

  return (
    <th
      className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center justify-between">
        <span>{column}</span>
        {isSorted && (
          <svg
            className={`w-4 h-4 transition-transform ${iconRotation}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v12a1 1 0 01-2 0V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </th>
  );
};

export default TableHeader;
