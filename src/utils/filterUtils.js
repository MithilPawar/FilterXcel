export const applyFilters = (data, filters) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  if (!Array.isArray(filters) || filters.length === 0) return data;

  try {
    return data.filter((row) => {
      return filters.every(({ column, condition, value }) => {
        if (!(column in row)) return false;

        const cellValue =
          row[column] !== undefined && row[column] !== null
            ? row[column].toString().toLowerCase().trim()
            : "";

        const filterValue =
          typeof value === "string" ? value.toLowerCase().trim() : "";

        switch (condition) {
          case "equals":
            return cellValue === filterValue;
          case "doesNotEqual":
            return cellValue !== filterValue;
          case "contains":
            return cellValue.includes(filterValue);
          case "doesNotContain":
            return !cellValue.includes(filterValue);
          case "greater":
          case "less": {
            const numCellValue =
              typeof row[column] === "number"
                ? row[column]
                : parseFloat(cellValue);
            const numFilterValue = parseFloat(filterValue);
            if (isNaN(numCellValue) || isNaN(numFilterValue)) {
              console.error(`Invalid numeric value for filter: ${filterValue}`);
              return false;
            }
            return condition === "greater"
              ? numCellValue > numFilterValue
              : numCellValue < numFilterValue;
          }
          case "between": {
            const [min, max] = Array.isArray(value)
              ? value
              : value.split(",").map(Number);
            if (isNaN(min) || isNaN(max)) {
              console.error(
                `Invalid range values for 'between' filter: ${value}`
              );
              return false;
            }
            const numCellValue = Number(cellValue);
            return numCellValue >= min && numCellValue <= max;
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
            console.warn(`Unknown filter condition: ${condition}`);
            return true;
        }
      });
    });
  } catch (error) {
    console.error("Error applying filters:", error);
    return data;
  }
};
