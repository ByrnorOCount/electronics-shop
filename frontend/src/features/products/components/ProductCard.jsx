/**
 * Displays a single product in a card format.
 * @param {object} props
 * @param {object} props.product - The product object from the API.
 * @param {string} props.product.name - The name of the product.
 * @param {string} props.product.description - A short description.
 * @param {number|string} props.product.price - The price of the product.
 * @param {string} props.product.image_url - The URL for the product image.
 */

import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks"; // Corrected import
import { addItem } from "../../cart/cartSlice";
import {
  addToWishlistLocal,
  removeFromWishlistLocal,
} from "../../wishlist/wishlistSlice";
import { wishlistService } from "../../../api";
import { selectToken } from "../../auth/authSlice";
import toast from "react-hot-toast";
import Icon from "../../../components/ui/Icon";
import { useCartActions } from "../../cart/useCartActions";
import Button from "../../../components/ui/Button";
import logger from "../../../utils/logger";

export default function ProductCard({ product }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken); // Get the token to check if user is logged in
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
  const { addItem } = useCartActions();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      // Optionally, navigate to login or show a toast message
      toast.error("Please log in to use the wishlist.");
      return;
    }

    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product.id);
        dispatch(removeFromWishlistLocal(product.id));
        toast.success(`'${product.name}' removed from wishlist.`);
      } else {
        await wishlistService.addToWishlist(product.id);
        dispatch(addToWishlistLocal(product));
        toast.success(`'${product.name}' added to wishlist!`);
      }
    } catch (error) {
      logger.error("Failed to update wishlist:", error);
      toast.error("Failed to update wishlist.");
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
            className="absolute top-2 right-2 p-2 bg-white/70 rounded-full hover:bg-white focus:outline-none transition-colors"
          >
            <Icon
              name="wishlist"
              className={`h-6 w-6 ${
                isWishlisted ? "text-red-500" : "text-gray-500"
              }`}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1 mb-1 h-10">
          {product.description}
        </p>
        <p className="text-lg font-semibold text-gray-800 mb-1">
          ${Number(product.price).toFixed(2)}
        </p>
        <Button
          onClick={handleAdd}
          size="sm"
          className="rounded-full bg-green-600 hover:bg-green-700 text-white"
        >
          Add to Cart
        </Button>
      </div>
    </Link>
  );
}
