import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { selectToken } from "../../auth/authSlice";
import toast from "react-hot-toast";
import Icon from "../../../components/ui/Icon";
import { useCartActions } from "../../cart/useCartActions";
import { useWishlistActions } from "../../wishlist/useWishlistActions";
import Button from "../../../components/ui/Button";

export default function ProductCard({ product }) {
  const token = useAppSelector(selectToken); // Get the token to check if user is logged in
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
  const { addItem } = useCartActions();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isLoading: isWishlistLoading,
  } = useWishlistActions();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please log in to use the wishlist.");
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
    >
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {token && (
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading(product.id)}
            className="absolute top-2 right-2 p-2 bg-white/70 rounded-full hover:bg-white focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWishlistLoading(product.id) ? (
              <Icon name="loader" className="h-6 w-6 animate-spin" />
            ) : (
              <Icon
                name="wishlist"
                className={`h-6 w-6 ${
                  isWishlisted ? "text-red-500" : "text-gray-500"
                }`}
                fill={isWishlisted ? "currentColor" : "none"}
              />
            )}
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1 mb-1 h-10">
          {product.description}
        </p>
        <p className="text-lg font-semibold text-gray-800 mb-1 text-right">
          ${Number(product.price).toFixed(2)}
        </p>
        <div className="flex items-center justify-end min-h-[32px] mt-2">
          {product.stock > 0 ? (
            <>
              {product.stock <= 10 && (
                <p className="text-orange-500 text-xs font-semibold mr-auto">
                  Only {product.stock} left in stock!
                </p>
              )}
              <Button
                onClick={handleAdd}
                size="sm"
                className="rounded-full bg-green-600 hover:bg-green-700 text-white"
              >
                Add to Cart
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="rounded-full bg-red-600 text-white cursor-not-allowed"
              disabled
            >
              Out of Stock
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
