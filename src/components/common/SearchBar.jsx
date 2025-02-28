import React, { useState, useEffect, useCallback } from "react";
import { X, Search } from "lucide-react";
import debounce from "lodash.debounce";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch, theme }) => {
  const [inputValue, setInputValue] = useState(searchTerm || "");

  // Debounce search updates
  const debouncedSearch = useCallback(
    debounce((value) => setSearchTerm(value), 500),
    [setSearchTerm]
  );

  useEffect(() => {
    debouncedSearch(inputValue);
    return () => debouncedSearch.cancel();
  }, [inputValue, debouncedSearch]);

  // Handle key events
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(inputValue);
    } else if (e.key === "Escape") {
      setInputValue("");
    }
  };

  return (
    <div className="relative w-full p-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 transition
                     ${
                       theme === "dark"
                         ? "border-gray-600 bg-gray-800 text-gray-100 focus:ring-emerald-500"
                         : "border-gray-300 bg-white text-gray-900 focus:ring-emerald-400"
                     }`}
        />
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
          size={20}
        />
        {inputValue && (
          <button
            onClick={() => setInputValue("")}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition ${
              theme === "dark"
                ? "text-gray-400 hover:text-red-400"
                : "text-gray-500 hover:text-red-500"
            }`}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
