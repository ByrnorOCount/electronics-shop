import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import ProductCard from "./components/ProductCard";
import ProductFilter from "./components/ProductFilter";
import Pagination from "../../components/ui/Pagination";
import { productService } from "../../api";

const ProductsPage = () => {
  const {
    data: productData,
    isLoading,
    isError,
    request: fetchProducts,
  } = useApi(productService.getProducts);
  const { data: categories, request: fetchCategories } = useApi(
    productService.getProductCategories
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sortBy: "created_at", // Default sort
    sortOrder: "desc", // Default order
    hide_out_of_stock: true,
  });

  useEffect(() => {
    // Reset to page 1 whenever filters change
    setCurrentPage(1);
  }, [
    filters.search,
    filters.category,
    filters.sortBy,
    filters.sortOrder,
    filters.hide_out_of_stock,
  ]);

  useEffect(() => {
    // Fetch categories once on component mount
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Debounce fetching to avoid too many API calls
    const handler = setTimeout(() => {
      fetchProducts({ ...filters, page: currentPage });
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(handler);
  }, [filters, currentPage, fetchProducts]);

  const products = productData?.products;
  const totalPages = productData?.totalPages;

  if (isLoading)
    return <div className="text-center p-8">Loading products...</div>;
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">
        Failed to fetch products. Please try again later.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <ProductFilter
        filters={filters}
        onFilterChange={setFilters}
        categories={categories || []}
      />
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No products found.</p>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductsPage;
