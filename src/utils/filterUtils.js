export const applyFilters = (data, filters) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  if (!Array.isArray(filters) || filters.length === 0) return data;

  return data.filter((row) => {
    return filters.every(({ column, condition, value }) => {
      if (!(column in row)) return false;
      
      const cellValue = row[column] !== undefined && row[column] !== null ? row[column].toString().toLowerCase().trim() : "";
      const filterValue = value.toString().toLowerCase().trim();

      switch (condition) {
        case "equals":
          return cellValue === filterValue;
        case "doesNotEqual":
          return cellValue !== filterValue;
        case "contains":
          return cellValue.includes(filterValue);
        case "doesNotContain":
          return !cellValue.includes(filterValue);
        case "greater": {
          const numCellValue = parseFloat(cellValue);
          const numFilterValue = parseFloat(filterValue);
          return !isNaN(numCellValue) && !isNaN(numFilterValue) && numCellValue > numFilterValue;
        }
        case "less": {
          const numCellValue = parseFloat(cellValue);
          const numFilterValue = parseFloat(filterValue);
          return !isNaN(numCellValue) && !isNaN(numFilterValue) && numCellValue < numFilterValue;
        }
        case "between": {
          const [min, max] = value.split(",").map(Number);
          const numCellValue = Number(cellValue);
          return !isNaN(numCellValue) && !isNaN(min) && !isNaN(max) && numCellValue >= min && numCellValue <= max;
        }        
        case "startsWith":
          return cellValue.startsWith(filterValue);
        case "endsWith":
          return cellValue.endsWith(filterValue);
        case "isEmpty":
          return cellValue === "";
        case "isNotEmpty":
          return cellValue !== "";
        default:
          return true;
      }
    });
  });
};