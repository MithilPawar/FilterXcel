import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";  // Importing debounce from lodash

const FilteringComponent = ({ data, setFilteredData }) => {
  const [filters, setFilters] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [hasFilters, setHasFilters] = useState(false);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const conditions = ["equals", "contains", "greater", "less", "between"];
  
  // Debounced filter application
  const applyFiltersDebounced = debounce(() => {
    applyFilters();
  }, 500);  // Waits 500ms after the user stops typing

  const addFilter = () => {
    setFilters([...filters, { column: "", condition: "equals", value: "" }]);
    setHasFilters(true);
  };

  const updateFilter = (index, key, value) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const applyFilters = () => {
    let filtered = data.slice(1); // Exclude header row
    let resultFound = false;

    filters.forEach(({ column, condition, value }) => {
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
            const [start, end] = value.split(",");
            const cellDate = parseDate(cellValue);
            return cellDate >= parseDate(start) && cellDate <= parseDate(end);
          default:
            return true;
        }
      });
    });

    if (filtered.length > 0) {
      setFilteredData([data[0], ...filtered]);
      setNoResults(false);
    } else {
      setNoResults(true);
      setFilteredData([data[0]]);
    }
  };

  // Memoizing filtered data to avoid unnecessary calculations
  const filteredData = useMemo(() => {
    return filters.length ? applyFilters() : data;
  }, [filters, data]);

  useEffect(() => {
    // Only apply filters after debouncing
    setDebouncedFilters(filters);
    applyFiltersDebounced();
  }, [filters]); // Re-run the debounced filter function whenever filters change

  const resetFilters = () => {
    setFilters([]);
    setFilteredData(data);
    setHasFilters(false);
    setNoResults(false);
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map((item) => parseInt(item, 10));
    return new Date(year, month - 1, day); // Convert to Date object
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">🔍 Apply Filters</h2>

      {filters.map((filter, index) => (
        <div key={index} className="flex gap-4 mb-4 items-center">
          <select
            className="p-3 border border-gray-300 rounded-lg focus:outline-none"
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
            className="p-3 border border-gray-300 rounded-lg focus:outline-none"
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
            className="p-3 border border-gray-300 rounded-lg focus:outline-none"
            placeholder="Enter value"
            onChange={(e) => updateFilter(index, "value", e.target.value)}
          />
        </div>
      ))}

      <div className="flex gap-6 mb-4">
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
          onClick={applyFilters}
          style={{ display: hasFilters ? "block" : "none" }}
        >
          ✅ Apply Filters
        </button>

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          onClick={resetFilters}
          style={{ display: hasFilters ? "block" : "none" }}
        >
          🔄 Reset Filters
        </button>

        <button
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg"
          onClick={addFilter}
        >
          ➕ Add Filter
        </button>
      </div>

      {noResults && (
        <p className="mt-4 text-red-600 font-semibold text-lg">
          😔 No results found for the applied filters.
        </p>
      )}
    </div>
  );
};

export default FilteringComponent;
