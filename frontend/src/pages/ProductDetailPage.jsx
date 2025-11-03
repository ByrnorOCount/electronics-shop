import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addItem } from '../features/cart/cartSlice';
import { addToWishlistLocal, removeFromWishlistLocal } from '../features/wishlist/wishlistSlice';
import { useApi } from '../hooks/useApi';
import productService from '../services/productService';
import cartService from '../services/cartService';
import wishlistService from '../services/wishlistService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { data: product, loading, error, request: fetchProduct } = useApi(productService.getProductById);

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
  const isWishlisted = product ? wishlistItems.some(item => item.id === product.id) : false;
  const navigate = useNavigate();
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);

  const handleAddToCart = async () => {
    if (product) {
      const itemToAdd = {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: 1,
        img: product.image_url,
        stock: product.stock,
      };
      if (token) {
        try {
          const backendItem = await cartService.addItemToCart(product.id, 1);
          // Dispatch again with the backend's cartItemId to keep Redux state in sync
          dispatch(addItem({ ...itemToAdd, cartItemId: backendItem.id }));
        } catch (error) {
          console.error("Failed to add item to backend cart:", error);
          // Here you could dispatch an action to show an error to the user
        }
      } else {
        // For guests, dispatch optimistically as before.
        dispatch(addItem(itemToAdd));
      }
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    if (!token) {
      // Redirect to login if a guest tries to use the wishlist
      navigate('/login', { state: { from: `/products/${product.id}` } });
      return;
    }

    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product.id);
        dispatch(removeFromWishlistLocal(product.id));
      } else {
        // The local action needs the full product object to display it in the wishlist
        await wishlistService.addToWishlist(product.id);
        dispatch(addToWishlistLocal(product));
      }
    }
    catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Product not found.</div>;
  // Don't render the component until the product has been fetched.
  if (!product) return null;

  return (
    <div className="container mx-auto p-8 mb-12">
      <div className="flex flex-col md:flex-row gap-8">
        <img src={product.image_url || 'https://via.placeholder.com/400'} alt={product.name} className="w-full md:w-1/2 rounded-lg shadow-lg" />
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-gray-800 mb-4">${Number(product.price).toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-sm text-gray-500 mb-6">In Stock: {product.stock}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleAddToCart} className="bg-green-600 text-white font-bold py-3 px-6 rounded hover:bg-green-700 transition duration-300 flex-1 text-center">
              Add to Cart
            </button>
            {isWishlisted ? (
              <button
                onClick={handleWishlistToggle}
                onMouseEnter={() => setIsWishlistHovered(true)}
                onMouseLeave={() => setIsWishlistHovered(false)}
                className="bg-red-400 text-white font-bold py-3 px-6 rounded hover:bg-red-500 transition duration-300 flex-1 text-center"
              >
                <span className="inline-block w-42">{isWishlistHovered ? 'Remove from Wishlist' : 'Added to Wishlist'}</span>
              </button>
            ) : (
              <button
                onClick={handleWishlistToggle}
                className="bg-red-600 text-white font-bold py-3 px-6 rounded hover:bg-red-700 transition duration-300 flex-1 text-center"
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
