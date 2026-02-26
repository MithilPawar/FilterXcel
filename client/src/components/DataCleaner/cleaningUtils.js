// Helper for stable stringify (keys sorted) to handle duplicates reliably
const stableStringify = (obj) =>
  JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {})
  );

// Helper for title case
const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

// Trim whitespace from selected columns
export const trimWhitespace = (data, columns = null) =>
  data.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        typeof value === "string" && (!columns || columns.includes(key)) ? value.trim() : value,
      ])
    )
  );

// Convert string cells to UPPER/lower/Title case in selected columns
export const changeCase = (data, mode = "upper", columns = null) =>
  data.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => {
        if (typeof value !== "string" || (columns && !columns.includes(key))) return [key, value];

        switch (mode) {
          case "upper":
            return [key, value.toUpperCase()];
          case "lower":
            return [key, value.toLowerCase()];
          case "title":
            return [key, toTitleCase(value)];
          default:
            return [key, value];
        }
      })
    )
  );

// Remove duplicate rows using stable stringify
export const removeDuplicates = (data) => {
  const seen = new Set();
  return data.filter((row) => {
    const stringified = stableStringify(row);
    if (seen.has(stringified)) return false;
    seen.add(stringified);
    return true;
  });
};

// Replace missing/null/empty cells in selected columns
// Optional: custom predicate to define missingness
export const fillMissingValues = (
  data,
  fillValue = "",
  columns = null,
  isMissing = (val) => val === null || val === undefined || val === ""
) =>
  data.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        (!columns || columns.includes(key)) && isMissing(value) ? fillValue : value,
      ])
    )
  );

// Drop rows with ANY null/undefined/empty value
// strict=true includes empty string as null, else only null/undefined
export const dropRowsWithNulls = (data, strict = true) =>
  data.filter((row) =>
    Object.values(row).every((val) =>
      strict ? val !== null && val !== undefined && val !== "" : val !== null && val !== undefined
    )
  );

// Drop columns where all values are null/undefined/empty
export const dropColumnsWithNulls = (data) => {
  if (!data.length) return data;

  const columns = Object.keys(data[0]);
  const columnsToKeep = columns.filter((col) =>
    data.some((row) => row[col] !== null && row[col] !== undefined && row[col] !== "")
  );

  return data.map((row) => {
    const newRow = {};
    columnsToKeep.forEach((col) => {
      newRow[col] = row[col];
    });
    return newRow;
  });
};

// Validate numeric columns (returns an object with invalid entries)
// Improved to use Number() and trim
export const findNonNumericCells = (data) => {
  const invalids = [];
  data.forEach((row, rowIndex) => {
    for (const [key, value] of Object.entries(row)) {
      if (
        value !== "" &&
        typeof value === "string" &&
        isNaN(Number(value.trim()))
      ) {
        invalids.push({ row: rowIndex + 1, column: key, value });
      }
    }
  });
  return invalids;
};

// Validate date columns (basic check using Date.parse)
export const findInvalidDates = (data) => {
  const invalids = [];
  data.forEach((row, rowIndex) => {
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === "string" && (value.includes("/") || value.includes("-"))) {
        const parsed = Date.parse(value);
        if (isNaN(parsed)) {
          invalids.push({ row: rowIndex + 1, column: key, value });
        }
      }
    }
  });
  return invalids;
};

// Replace specific value in a column (strict equality by default)
// Optionally, allow trimming & type coercion for matching
export const replaceValueInColumn = (
  data,
  column,
  fromValue,
  toValue,
  options = { trimStrings: false, looseCompare: false }
) => {
  return data.map((row) => {
    const cell = row[column];
    let isMatch;
    if (options.trimStrings && typeof cell === "string" && typeof fromValue === "string") {
      isMatch = cell.trim() === fromValue.trim();
    } else if (options.looseCompare) {
      isMatch = cell == fromValue; // eslint-disable-line eqeqeq
    } else {
      isMatch = cell === fromValue;
    }
    return {
      ...row,
      [column]: isMatch ? toValue : cell,
    };
  });
};
