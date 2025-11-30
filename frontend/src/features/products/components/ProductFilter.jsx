import React, { useState } from "react";
import Select from "../../../components/ui/Select";
import Spinner from "../../../components/ui/Spinner";

const ProductFilter = ({
  filters,
  onFilterChange,
  categories = [],
  searchTerm,
  isSearching,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onFilterChange({ ...filters, [name]: checked });
  };

  const handleReset = () => {
    // Pass a minimal object. The parent component knows the defaults.
    onFilterChange({
      search: "",
      ...Object.fromEntries(
        Object.keys(filters).map((key) => [key, undefined])
      ),
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <input
            type="text"
            name="search"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search by name..."
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {isSearching && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <Spinner size={5} />
            </div>
          )}
        </div>

        {/* Category Select */}
        <Select
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((cat) => ({
              value: cat.name,
              label: cat.name,
            })),
          ]}
          placeholder="Filter by Category"
        />

        {/* Sort By Dropdown */}
        <Select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleInputChange}
          options={[
            { value: "created_at", label: "Default" },
            { value: "name", label: "Name" },
            { value: "price", label: "Price" },
            { value: "stock", label: "Stock" },
          ]}
          placeholder="Sort by..."
        />

        {/* Sort Order Dropdown */}
        <Select
          name="sortOrder"
          value={filters.sortOrder}
          onChange={handleInputChange}
          options={[
            { value: "desc", label: "Descending" },
            { value: "asc", label: "Ascending" },
          ]}
          placeholder="Order by..."
        />

        <div className="lg:col-start-1 flex items-center justify-start gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="hide_out_of_stock"
              checked={filters.hide_out_of_stock}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Hide out of stock</span>
          </label>
        </div>
        <div className="lg:col-start-5 flex items-center justify-end">
          <button
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
