/**
 * Fetches and displays featured products from the API.
 */
import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import productService from "../productService";
import { useApi } from "../../../hooks/useApi";

export default function FeaturedGrid() {
  const { data: products, loading, error, request: fetchFeaturedProducts } = useApi(productService.getFeaturedProducts);

  useEffect(() => {
    fetchFeaturedProducts();
    // We only want this to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading featured products...</p>;
  if (error) return <p className="text-center text-red-500">Error: Could not load featured products.</p>;
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">No featured products available at the moment.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
      {products?.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
