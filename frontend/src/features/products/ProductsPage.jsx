import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import ProductCard from './components/ProductCard';
import ProductFilter from './components/ProductFilter';
import { productService } from '../../api';

const ProductsPage = () => {
  const { data: products, loading, error, request: fetchProducts } = useApi(productService.getProducts);
  const { data: categories, request: fetchCategories } = useApi(productService.getProductCategories);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    min_price: '',
    max_price: '',
  });

  useEffect(() => {
    // Fetch categories once on component mount
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Debounce fetching to avoid too many API calls
    const handler = setTimeout(() => {
      fetchProducts(filters);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(handler);
  }, [filters, fetchProducts]);

  if (loading) return <div className="text-center p-8">Loading products...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Failed to fetch products. Please try again later.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <ProductFilter filters={filters} onFilterChange={setFilters} categories={categories || []} />
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductsPage;
