/**
 * Fetches and displays featured products from the API.
 */
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

export default function FeaturedGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // The API endpoint should return products where `is_featured` is true.
        const response = await fetch("/api/products?featured=true");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading featured products...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
