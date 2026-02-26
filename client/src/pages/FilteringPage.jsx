import React from "react";
import Filter from "../components/Filter/FilterPage";

const FilteringPage = () => {
  return (
    <div className="w-full px-4 py-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">Filters</h1>
      <Filter />
    </div>
  );
};

export default FilteringPage;
