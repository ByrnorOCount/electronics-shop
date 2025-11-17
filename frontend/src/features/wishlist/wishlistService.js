import api from "../../api/axios";

const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data.data;
};

const addToWishlist = async (productId) => {
  const response = await api.post("/wishlist", { productId });
  return response.data.data;
};

const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data.data;
};

const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

export default wishlistService;
