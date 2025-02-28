import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useRef } from "react";
import { useMemo } from "react";
import {
  addFilter,
  removeFilter,
  resetFilters,
} from "../../../redux/slices/fileSlice";
import DataTable from "../../DataTable/DataTable";

const FilteringComponent = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const filteredData = useSelector(
    (state) => state.file.filteredData,
    shallowEqual
  );
  const filters = useSelector((state) => state.file.filters, shallowEqual);

  const columns = useMemo(() => {
    if (filteredData.length > 0 && typeof filteredData[0] === "object") {
      return Object.keys(filteredData[0]).filter((col) => isNaN(col));
    }
    return [];
  }, [filteredData]);

  const [filter, setFilter] = useState({
    column: "",
    condition: "",
    value: "",
    minValue: "",
    maxValue: "",
  });

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filters"));
    if (savedFilters?.length) {
      savedFilters.forEach((f) => dispatch(addFilter(f)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  const handleAddFilter = useCallback(() => {
    if (filter.column) {
      const filterToAdd =
        filter.condition === "between"
          ? { ...filter, value: `${filter.minValue},${filter.maxValue}` }
          : { ...filter, value: filter.value };

      if (
        (filter.condition === "between" &&
          filter.minValue &&
          filter.maxValue) ||
        (filter.condition !== "between" && filter.value)
      ) {
        dispatch(addFilter(filterToAdd));
        setFilter({
          column: "",
          condition: "",
          value: "",
          minValue: "",
          maxValue: "",
        });
      }
    }
  }, [dispatch, filter]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setFilter((prev) => {
      let updatedFilter = { ...prev, [name]: value };

      if (name === "column") {
        updatedFilter.condition = "equals";
      }

      return updatedFilter;
    });

    if (name === "condition" && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Filters</h3>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <select
          name="column"
          value={filter.column}
          onChange={handleInputChange}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Column</option>
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        <select
          name="condition"
          value={filter.condition}
          onChange={handleInputChange}
          disabled={!filter.column}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          <option value="" disabled>
            Select Operation
          </option>
          <option value="equals">Equals</option>
          <option value="doesNotEqual">Does Not Equal</option>
          <option value="contains">Contains</option>
          <option value="doesNotContain">Does Not Contain</option>
          <option value="greater">Greater Than</option>
          <option value="less">Less Than</option>
          <option value="between">Between (min,max)</option>
          <option value="startsWith">Starts With</option>
          <option value="endsWith">Ends With</option>
          <option value="isEmpty">Is Empty</option>
          <option value="isNotEmpty">Is Not Empty</option>
        </select>

        {filter.condition === "between" ? (
          <div className="flex gap-2">
            <input
              type="text"
              name="minValue"
              placeholder="Min value"
              value={filter.minValue}
              onChange={handleInputChange}
              className="border p-2 rounded w-1/2 focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="maxValue"
              placeholder="Max value"
              value={filter.maxValue}
              onChange={handleInputChange}
              className="border p-2 rounded w-1/2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ) : (
          <input
            type="text"
            name="value"
            placeholder="Enter value"
            ref={inputRef}
            value={filter.value}
            onChange={handleInputChange}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
          />
        )}

        <button
          onClick={handleAddFilter}
          disabled={
            !filter.column || (!filter.value && filter.condition !== "between")
          }
          className={`bg-blue-500 text-white p-2 rounded ${
            !filter.column || (!filter.value && filter.condition !== "between")
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
        >
          ➕ Add Filter
        </button>
      </div>

      {filters.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 p-3 bg-gray-100 rounded-lg">
          {filters.map((f, index) => (
            <div
              key={index}
              className="bg-blue-100 text-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
            >
              <span className="text-gray-800 font-medium">
                {`Column: ${f.column} | Condition: ${f.condition} | Value: ${f.value}`}
              </span>
              <button
                onClick={() => dispatch(removeFilter(f))}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ❌
              </button>
            </div>
          ))}
          <button
            onClick={() => dispatch(resetFilters())}
            className="bg-gray-300 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-400 transition-all"
          >
            Clear All ❌
          </button>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Filtered Data
        </h3>
        {filteredData.length === 0 ? (
          <p className="text-gray-600 mt-4 text-center">
            No results found. Try modifying your filters.
          </p>
        ) : (
          <DataTable data={filteredData} />
        )}
      </div>
    </div>
  );
};

export default FilteringComponent;
