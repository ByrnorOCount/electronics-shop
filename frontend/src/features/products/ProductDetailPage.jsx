import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { useApi } from "../../hooks/useApi";
import { productService } from "../../api";
import toast from "react-hot-toast";
import { useCartActions } from "../cart/useCartActions";
import { useWishlistActions } from "../wishlist/useWishlistActions";

const ProductDetailPage = () => {
  const { id } = useParams();
  const {
    data: product,
    isLoading,
    isError,
    request: fetchProduct,
  } = useApi(productService.getProductById);
  const { addItem: addItemToCart } = useCartActions();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isLoading: isWishlistLoading,
  } = useWishlistActions();

  useEffect(() => {
    // The `id` is a string from the URL, but our services expect a number.
    if (id) {
      fetchProduct(id).catch(() => {
        // The useApi hook already logs the error, so we can just let it fail silently here
        // from the component's perspective, or add more specific UI feedback if needed.
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { token } = useAppSelector((state) => state.auth);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  // Safely check if the product is wishlisted, even if product is not yet loaded.
  const isWishlisted = product
    ? wishlistItems.some((item) => item.id === product.id)
    : false;
  const navigate = useNavigate();
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    // The useCartActions hook handles all logic for guests vs. logged-in users.
    // It also provides user feedback via toasts.
    addItemToCart(product);
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    if (!token) {
      // Redirect to login if a guest tries to use the wishlist
      toast.error("Please log in to use the wishlist.");
      navigate("/login", { state: { from: `/products/${product.id}` } });
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      // The hook handles adding the full product object
      addToWishlist(product);
    }
  };

  const isCurrentlyLoading = isWishlistLoading(product?.id);

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">Product not found.</div>
    );
  // Don't render the component until the product has been fetched.
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.image_url || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full md:w-1/2 rounded-lg shadow-lg"
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-gray-800 mb-4">
            ${Number(product.price).toFixed(2)}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-sm text-gray-500 mb-6">
            In Stock: {product.stock}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-green-600 text-white font-bold py-3 px-6 rounded hover:bg-green-700 transition duration-300 flex-1 text-center"
            >
              Add to Cart
            </button>
            {isWishlisted ? (
              <button
                onClick={handleWishlistToggle}
                onMouseEnter={() => setIsWishlistHovered(true)}
                onMouseLeave={() => setIsWishlistHovered(false)}
                disabled={isCurrentlyLoading}
                className="bg-red-400 text-white font-bold py-3 px-6 rounded hover:bg-red-500 transition duration-300 flex-1 text-center disabled:bg-gray-400"
              >
                <span className="inline-block w-42">
                  {isCurrentlyLoading
                    ? "Updating..."
                    : isWishlistHovered
                    ? "Remove from Wishlist"
                    : "Added to Wishlist"}
                </span>
              </button>
            ) : (
              <button
                onClick={handleWishlistToggle}
                disabled={isCurrentlyLoading}
                className="bg-red-600 text-white font-bold py-3 px-6 rounded hover:bg-red-700 transition duration-300 flex-1 text-center disabled:bg-gray-400"
              >
                <span className="inline-block w-40">Add to Wishlist</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
