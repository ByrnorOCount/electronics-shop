import React, { useState } from "react";
import Icon from "../../../components/ui/Icon";
import Spinner from "../../../components/ui/Spinner";

const ProductFilter = ({
  filters,
  onFilterChange,
  categories = [],
  searchTerm,
  isSearching,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleDropdownInteraction = (e, dropdownName) => {
    const { type, key } = e;

    // Open dropdown on click, spacebar, or enter key
    if (
      type === "mousedown" ||
      (type === "keydown" && (key === "Enter" || key === " "))
    ) {
      setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    }

    // Close dropdown when an option is selected or focus is lost
    if (type === "change" || type === "blur") {
      setActiveDropdown(null);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onFilterChange({ ...filters, [name]: checked });
  };

  const handleReset = () => {
    setActiveDropdown(null);
    // Pass a minimal object. The parent component knows the defaults.
    onFilterChange({
      search: "",
      ...Object.fromEntries(
        Object.keys(filters).map((key) => [key, undefined])
      ),
    });
  };

  const selectClasses =
    "w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none";

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
        <div className="relative">
          <select
            name="category"
            value={filters.category}
            onChange={(e) => {
              handleInputChange(e);
              handleDropdownInteraction(e, "category");
            }}
            onMouseDown={(e) => handleDropdownInteraction(e, "category")}
            onKeyDown={(e) => handleDropdownInteraction(e, "category")}
            onBlur={(e) => handleDropdownInteraction(e, "category")}
            className={selectClasses}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <Icon
            name={
              activeDropdown === "category" ? "chevron-down" : "chevron-right"
            }
            className="h-5 w-5 text-gray-500 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="relative">
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={(e) => {
              handleInputChange(e);
              handleDropdownInteraction(e, "sortBy");
            }}
            onMouseDown={(e) => handleDropdownInteraction(e, "sortBy")}
            onKeyDown={(e) => handleDropdownInteraction(e, "sortBy")}
            onBlur={(e) => handleDropdownInteraction(e, "sortBy")}
            className={selectClasses}
          >
            <option value="created_at">Default</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
          <Icon
            name={
              activeDropdown === "sortBy" ? "chevron-down" : "chevron-right"
            }
            className="h-5 w-5 text-gray-500 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none"
          />
        </div>

        {/* Sort Order Dropdown */}
        <div className="relative">
          <select
            name="sortOrder"
            value={filters.sortOrder}
            onChange={(e) => {
              handleInputChange(e);
              handleDropdownInteraction(e, "sortOrder");
            }}
            onMouseDown={(e) => handleDropdownInteraction(e, "sortOrder")}
            onKeyDown={(e) => handleDropdownInteraction(e, "sortOrder")}
            onBlur={(e) => handleDropdownInteraction(e, "sortOrder")}
            className={selectClasses}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
          <Icon
            name={
              activeDropdown === "sortOrder" ? "chevron-down" : "chevron-right"
            }
            className="h-5 w-5 text-gray-500 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none"
          />
        </div>

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
