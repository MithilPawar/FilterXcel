// DataPreview.jsx
import React from 'react';
import ColumnHeader from '../ColumnHeader/ColumnHeader';

const DataPreview = ({
  data = [],
  handleSort,
  currentPage = 1,
  rowsPerPage = 10,
  sortedColumn,
  sortDirection,
}) => {
  if (!data || data.length === 0) {
    return <p className="text-center mt-4">No data available</p>;
  }

  const header = data[0] || [];
  const rows = data.slice(1) || [];

  const startRow = (currentPage - 1) * rowsPerPage;
  const endRow = startRow + rowsPerPage;
  const visibleRows = rows.slice(startRow, endRow);

  return (
    <table className="min-w-full table-auto mt-4">
      <thead>
        <tr>
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
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex} className="px-4 py-2 border">
                {cell || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataPreview;
