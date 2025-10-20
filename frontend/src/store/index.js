import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import productReducer from '../features/products/productSlice'; // 1. Import reducer mới

const persistConfig = {
  key: 'root',
  storage,
  // Only persist the cart. The auth state is managed by tokens and shouldn't be persisted this way.
  // Products are fetched on load, so we don't need to persist them.
  whitelist: ['cart'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer, // 2. Thêm reducer vào store
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
