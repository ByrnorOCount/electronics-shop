import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchWishlist } from "./wishlistSlice";
import ProductCard from "../products/components/ProductCard";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.wishlist);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Fetch wishlist only if the user is logged in and the list hasn't been fetched yet.
    if (token && status === "idle") {
      dispatch(fetchWishlist());
    }
  }, [token, status, dispatch]);

  let content;

  if (status === "loading") {
    content = <p className="text-center">Loading your wishlist...</p>;
  } else if (status === "succeeded" && items.length === 0) {
    content = (
      <div className="text-center bg-white p-12 rounded-lg shadow-sm">
        <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
        <p className="text-sm text-gray-500 mb-6">
          Add products you love to your wishlist to see them here.
        </p>
        <Link
          to="/products"
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Discover Products
        </Link>
      </div>
    );
  } else if (status === "succeeded") {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  } else if (status === "failed") {
    content = <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <main className="flex-grow max-w-screen-xl mx-auto px-4 py-12 w-full">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {content}
    </main>
  );
}
