import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

const FilteringComponent = ({ data, setFilteredData, searchTerm, theme }) => {
  const [filters, setFilters] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const conditions = ["equals", "contains", "greater", "less", "between"];

  const addFilter = () => {
    setFilters([...filters, { column: "", condition: "equals", value: "", secondValue: "" }]);
  };

  const updateFilter = (index, key, value) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const parseDate = (dateStr) => {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  };

  const applyFilters = useCallback(() => {
    let filtered = data.slice(1);

    filters.forEach(({ column, condition, value, secondValue }) => {
      if (!column || value === "") return;

      filtered = filtered.filter((row) => {
        const cellValue = row[column]?.toString().toLowerCase();
        const filterValue = value.toLowerCase();

        switch (condition) {
          case "equals":
            return cellValue === filterValue;
          case "contains":
            return cellValue.includes(filterValue);
          case "greater":
            return parseFloat(cellValue) > parseFloat(value);
          case "less":
            return parseFloat(cellValue) < parseFloat(value);
          case "between":
            if (!secondValue) return false;
            const [start, end] = [parseDate(value), parseDate(secondValue)];
            const cellDate = parseDate(cellValue);
            return cellDate >= start && cellDate <= end;
          default:
            return true;
        }
      });
    });

    if (searchTerm) {
      filtered = filtered.filter((row) =>
        row.some((cell) => cell.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredData(filtered.length > 0 ? [data[0], ...filtered] : [data[0]]);
    setNoResults(filtered.length === 0);
  }, [filters, searchTerm, data, setFilteredData]);

  useEffect(() => {
    const debouncedApply = debounce(applyFilters, 500);
    debouncedApply();
    return () => debouncedApply.cancel();
  }, [applyFilters]);

  const resetFilters = () => {
    setFilters([]);
    setFilteredData(data);
    setNoResults(false);
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-lg mb-8 transition ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">🔍 Apply Filters</h2>

      {filters.map((filter, index) => (
        <div key={index} className="flex gap-4 mb-4 items-center">
          <select
            className={`p-3 border rounded-lg transition ${
              theme === "dark"
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
            }`}
            value={filter.column}
            onChange={(e) => updateFilter(index, "column", e.target.value)}
          >
            <option value="">Select Column</option>
            {data[0]?.map((col, i) => (
              <option key={i} value={i}>
                {col}
              </option>
            ))}
          </select>

          <select
            className={`p-3 border rounded-lg transition ${
              theme === "dark"
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
            }`}
            value={filter.condition}
            onChange={(e) => updateFilter(index, "condition", e.target.value)}
          >
            {conditions.map((cond, i) => (
              <option key={i} value={cond}>
                {cond}
              </option>
            ))}
          </select>

          <input
            type="text"
            className={`p-3 border rounded-lg transition ${
              theme === "dark"
                ? "border-gray-600 bg-gray-700 text-white"
                : "border-gray-300 bg-white text-gray-900"
            }`}
            placeholder="Enter value"
            value={filter.value}
            onChange={(e) => updateFilter(index, "value", e.target.value)}
          />

          {filter.condition === "between" && (
            <input
              type="text"
              className={`p-3 border rounded-lg transition ${
                theme === "dark"
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
              placeholder="Enter second value"
              value={filter.secondValue}
              onChange={(e) => updateFilter(index, "secondValue", e.target.value)}
            />
          )}
        </div>
      ))}

      <div className="flex gap-6 mb-4">
        {filters.length > 0 && (
          <>
            <button
              className={`px-6 py-3 rounded-lg transition ${
                theme === "dark"
                  ? "bg-green-500 text-white hover:bg-green-400"
                  : "bg-green-600 text-white hover:bg-green-500"
              }`}
              onClick={applyFilters}
            >
              ✅ Apply Filters
            </button>

            <button
              className={`px-6 py-3 rounded-lg transition ${
                theme === "dark"
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
              onClick={resetFilters}
            >
              🔄 Reset Filters
            </button>
          </>
        )}

        <button
          className={`px-6 py-3 rounded-lg transition ${
            theme === "dark"
              ? "bg-yellow-500 text-white hover:bg-yellow-400"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
          onClick={addFilter}
        >
          ➕ Add Filter
        </button>
      </div>

      {noResults && (
        <p
          className={`mt-4 font-semibold text-lg transition ${
            theme === "dark" ? "text-red-400" : "text-red-600"
          }`}
        >
          😔 No results found.
        </p>
      )}
    </div>
  );
};

export default FilteringComponent;
