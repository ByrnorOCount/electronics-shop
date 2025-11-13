import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from './wishlistService';

// Async thunk to fetch the user's wishlist from the backend
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    if (!token) return rejectWithValue('User is not logged in.');
    try {
      const data = await wishlistService.getWishlist();
      return data; // The API returns an array of product objects
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [], // Will store full product objects
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Action to add an item optimistically to the UI
    addToWishlistLocal: (state, action) => {
      const product = action.payload;
      if (!state.items.find(item => item.id === product.id)) {
        state.items.push(product);
      }
    },
    // Action to remove an item optimistically from the UI
    removeFromWishlistLocal: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },
    clearWishlist: (state) => {
      state.items = [];
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addToWishlistLocal, removeFromWishlistLocal, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
