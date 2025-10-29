import React, { useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useApi } from '../hooks/useApi';
import productService from '../services/productService';

const ProductsPage = () => {
  const { data: products, loading, error, request: fetchProducts } = useApi(productService.getProducts);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="text-center p-8">Loading products...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Failed to fetch products. Please try again later.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
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
