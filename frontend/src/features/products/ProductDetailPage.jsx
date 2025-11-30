import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { useApi } from "../../hooks/useApi";
import { productService } from "../../api";
import toast from "react-hot-toast";
import { useCartActions } from "../cart/useCartActions";
import { useWishlistActions } from "../wishlist/useWishlistActions";
import ProductCard from "./components/ProductCard";
import Spinner from "../../components/ui/Spinner";

const ProductDetailPage = () => {
  const { id } = useParams();
  const {
    data: product,
    isLoading,
    isError,
    request: fetchProduct,
  } = useApi(productService.getProductById);
  const {
    data: similarProductsData,
    isLoading: isLoadingSimilar,
    request: fetchSimilarProducts,
  } = useApi(productService.getProducts);
  const { addItem: addItemToCart } = useCartActions();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isLoading: isWishlistLoading,
  } = useWishlistActions();

  const similarProducts = similarProductsData?.products;

  useEffect(() => {
    if (id) {
      fetchProduct(id)
        .then((p) => {
          if (p && p.category_name) {
            // Fetch 5 products to ensure we have 4 recommendations
            // even if the current product is in the result set.
            const limit = 5;
            fetchSimilarProducts({ category: p.category_name, limit });
          }
        })
        .catch(() => {
          // The useApi hook already logs the error, so we can just let it fail silently here
          // from the component's perspective, or add more specific UI feedback if needed.
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Rerun when the product ID in the URL changes

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

  const StockDisplay = ({ stock }) => {
    if (stock === 0) {
      return <p className="text-red-600 font-semibold mb-6">Out of Stock</p>;
    }
    if (stock <= 10) {
      return (
        <p className="text-orange-500 font-semibold mb-6">
          Low Stock: {stock} remaining
        </p>
      );
    }
    return (
      <p className="text-green-600 font-semibold mb-6">
        In Stock ({stock} available)
      </p>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size={12} />
      </div>
    );
  }
  if (isError)
    return (
      <div className="text-center p-8 text-red-500">Product not found.</div>
    );
  // Don't render the component until the product has been fetched.
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={product.image_url || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full md:w-1/2 rounded-lg shadow-lg object-cover"
          />
          <div className="flex flex-col justify-center gap-y-4">
            <div>
              <h1 className="text-4xl font-bold">{product.name}</h1>
              {product.category_name && (
                <p className="text-md text-gray-500 mt-1">
                  Category: {product.category_name}
                </p>
              )}
            </div>
            <p className="text-2xl text-gray-900">
              ${Number(product.price).toFixed(2)}
            </p>
            <p className="text-lg text-gray-800 leading-relaxed">
              {product.description}
            </p>

            <StockDisplay stock={product.stock} />

            {/* Recommendation message for low/no stock */}
            {product.stock <= 5 && ( // This div already has mb-6, which is fine as it's a distinct block
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
                <p className="font-bold">
                  {product.stock === 0
                    ? "This item is out of stock."
                    : "Stock is running low!"}
                </p>
                <p>
                  Why not{" "}
                  <Link
                    to="/products"
                    className="underline hover:text-yellow-800"
                  >
                    check out other products
                  </Link>{" "}
                  {product.category_name && (
                    <>or browse items in the same category below?</>
                  )}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-green-600 text-white font-bold py-3 px-6 rounded hover:bg-green-700 transition duration-300 flex-1 text-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
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

      {similarProducts && similarProducts.length > 1 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Similar Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts
              .filter((p) => p.id !== product.id) // Exclude the current product
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
