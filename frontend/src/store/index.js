import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
// import { apiSlice } from '../services/apiSlice'; // optional RTK Query

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        // [apiSlice.reducerPath]: apiSlice.reducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
