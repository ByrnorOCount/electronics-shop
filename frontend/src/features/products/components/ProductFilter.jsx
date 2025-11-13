import React from 'react';

const ProductFilter = ({ filters, onFilterChange, categories = [] }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      category: '',
      min_price: '',
      max_price: '',
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Search by name..."
          className="lg:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />

        {/* Category Select */}
        <select
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        {/* Price Inputs */}
        <input type="number" name="min_price" value={filters.min_price} onChange={handleInputChange} placeholder="Min price" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        <input type="number" name="max_price" value={filters.max_price} onChange={handleInputChange} placeholder="Max price" className="w-full px-3 py-2 border border-gray-300 rounded-md" />

        <button onClick={handleReset} className="lg:col-start-5 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
