/**
 * Fetches and displays featured products from the API.
 */
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import api from "../services/api";

export default function FeaturedGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get("/products?featured=true");
        const data = response.data;
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
