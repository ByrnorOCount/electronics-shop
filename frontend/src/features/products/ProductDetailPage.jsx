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
import ChatbotWidget from "../chatbot/ChatbotWidget";

const RECENTLY_VIEWED_STORAGE_KEY = "electronics-shop:recently-viewed";

const formatSpecificationLabel = (key) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());

const formatSpecificationValue = (value) => {
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
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
    let isCurrentPage = true;

    const loadProductContext = async () => {
      if (!id) return;

      try {
        const viewedProduct = await fetchProduct(id);
        if (!isCurrentPage || !viewedProduct) return;

        if (viewedProduct.category_name) {
          fetchSimilarProducts({
            category: viewedProduct.category_name,
            limit: 5,
          }).catch(() => {});
        }

        let previousProductIds = [];
        try {
          const storedIds = JSON.parse(
            window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY) || "[]",
          );
          if (Array.isArray(storedIds)) {
            previousProductIds = storedIds
              .map(Number)
              .filter(
                (productId) =>
                  Number.isInteger(productId) &&
                  productId > 0 &&
                  productId !== Number(viewedProduct.id),
              )
              .slice(0, 5);
          }
          window.localStorage.setItem(
            RECENTLY_VIEWED_STORAGE_KEY,
            JSON.stringify([Number(viewedProduct.id), ...previousProductIds]),
          );
        } catch {
          previousProductIds = [];
        }

        const products = await Promise.all(
          previousProductIds.map(async (productId) => {
            try {
              return await productService.getProductById(productId);
            } catch {
              return null;
            }
          }),
        );

        if (isCurrentPage) {
          setRecentlyViewedProducts(products.filter(Boolean));
        }
      } catch {
        setRecentlyViewedProducts([]);
      }
    };

    loadProductContext();

    return () => {
      isCurrentPage = false;
    };
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

  const specificationEntries =
    product.specifications &&
    typeof product.specifications === "object" &&
    !Array.isArray(product.specifications)
      ? Object.entries(product.specifications).filter(
          ([, value]) => value !== null && value !== undefined && value !== "",
        )
      : [];

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

      {specificationEntries.length > 0 && (
        <section
          className="mt-10"
          aria-labelledby="product-specifications-heading"
        >
          <div className="mb-4">
            <h2
              id="product-specifications-heading"
              className="text-2xl font-bold"
            >
              Technical specifications
            </h2>
            <p className="mt-1 text-gray-600">
              Core hardware and connection details.
            </p>
          </div>
          <dl className="divide-y divide-gray-200 border-y border-gray-300">
            {specificationEntries.map(([key, value], index) => (
              <div
                key={key}
                className={`grid gap-1 px-3 py-3 sm:grid-cols-[minmax(12rem,1fr)_2fr] sm:gap-6 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <dt className="text-sm font-semibold text-gray-800">
                  {formatSpecificationLabel(key)}
                </dt>
                <dd className="break-words text-sm font-medium text-gray-950">
                  {formatSpecificationValue(value)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section aria-labelledby="product-guide-heading" className="mt-10">
        <div className="mb-4">
          <h2 id="product-guide-heading" className="text-2xl font-bold">
            Product guide
          </h2>
          <p className="mt-1 text-gray-600">
            Ask about specifications, project ideas, or coding with this
            product.
          </p>
        </div>
        <ChatbotWidget product={product} />
        <p className="mt-2 text-xs text-gray-500">
          Supplemental research may use manufacturer guides and Wikipedia; store
          price and stock come from ElectroShop.
        </p>
      </section>

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

      {recentlyViewedProducts.length > 0 && (
        <section className="mt-12" aria-labelledby="recently-viewed-heading">
          <h2 id="recently-viewed-heading" className="mb-6 text-2xl font-bold">
            Recently viewed
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewedProducts.map((recentProduct) => (
              <ProductCard key={recentProduct.id} product={recentProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
