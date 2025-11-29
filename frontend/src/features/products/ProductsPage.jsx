import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import ProductCard from "./components/ProductCard";
import ProductFilter from "./components/ProductFilter";
import Pagination from "../../components/ui/Pagination";
import { productService } from "../../api";
import { useDebounce } from "../../hooks/useDebounce";

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

  const [searchParams, setSearchParams] = useSearchParams();
  // Local state for the search input to allow for debouncing
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Derive filters and page from URL search params
  const { filters, currentPage } = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const hideOutOfStockParam = searchParams.get("hide_out_of_stock");

    const currentFilters = {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      sortBy: searchParams.get("sortBy") || "created_at",
      sortOrder: searchParams.get("sortOrder") || "desc",
      // Default to true if the param is not present
      hide_out_of_stock:
        hideOutOfStockParam === null ? true : hideOutOfStockParam === "true",
    };
    return { filters: currentFilters, currentPage: page };
  }, [searchParams]);

  // Debounce the search term from the local state
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Effect to update the URL when the debounced search term changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    // Reset to page 1 on search by removing the page param (page 1 is default)
    params.delete("page");
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const defaultFilters = {
    category: "",
    sortBy: "created_at",
    sortOrder: "desc",
    hide_out_of_stock: true,
  };

  const handleFilterChange = (newFilters) => {
    // Update local search term immediately for a responsive input field
    setSearchTerm(newFilters.search);

    const params = new URLSearchParams(searchParams);
    // Reset to page 1 when filters change by removing the page param
    params.delete("page");
    Object.entries(newFilters).forEach(([key, value]) => {
      // The search term is handled by its own debounced effect
      if (key !== "search") {
        // If the value is the same as the default, remove it from the URL.
        // Otherwise, set it.
        const isDefault =
          defaultFilters.hasOwnProperty(key) && value === defaultFilters[key];
        if (isDefault || value === "" || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    if (newPage === 1) {
      params.delete("page"); // Page 1 is the default, so remove the param
    } else {
      params.set("page", String(newPage));
    }
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    // Fetch categories once on component mount
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Fetch products whenever filters or page changes
    fetchProducts({ ...filters, page: currentPage });
  }, [filters, currentPage, fetchProducts]);

  const products = productData?.products;
  const totalPages = productData?.totalPages;

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
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        isSearching={isLoading}
        categories={categories || []}
      />
      {isLoading && (!products || products.length === 0) ? (
        <div className="text-center p-8">Loading products...</div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          No products found matching your criteria.
        </p>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductsPage;
