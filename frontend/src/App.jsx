import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/home/HomePage";
import api from "./api/axios";

import ProductsPage from "./features/products/ProductsPage";
import ProductDetailPage from "./features/products/ProductDetailPage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import SupportPage from "./pages/SupportPage";
import WarrantyPage from "./pages/WarrantyPage";
import NotFoundPage from "./pages/NotFoundPage";
import CartPage from "./features/cart/CartPage";
import WishlistPage from "./features/wishlist/WishlistPage";
import CheckoutPage from "./features/checkout-orders/CheckoutPage";
import OrderConfirmationPage from "./features/checkout-orders/OrderConfirmationPage";
import OrderHistoryPage from "./features/checkout-orders/OrderHistoryPage";
import SettingsPage from "./features/user/SettingsPage";
import NotificationsPage from "./features/notifications/NotificationsPage";
import ProfilePage from "./features/user/ProfilePage";
// import AdminLayout from "./features/admin/components/AdminLayout";
// import AdminDashboardPage from "./features/admin/AdminDashboardPage";
// import AdminProductsPage from "./features/admin/AdminProductsPage";
// import AdminOrdersPage from "./features/admin/AdminOrdersPage";
// import AdminUsersPage from "./features/admin/AdminUsersPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import CartSyncManager from "./features/cart/components/CartSyncManager";

/**
 * Fetches the CSRF token from the backend to enable secure requests.
 * This is a key part of the Double-Submit Cookie CSRF protection pattern.
 * It's called once when the application loads.
 */
const initializeCsrf = async () => {
  try {
    await api.get("/csrf-token");
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

function App() {
  // Fetch the CSRF token when the application first loads.
  // This ensures that subsequent state-changing API calls (POST, PUT, DELETE)
  // will have the necessary token to pass the backend's security check.
  useEffect(() => {
    initializeCsrf();
  }, []);
  return (
    <>
      <CartSyncManager />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          {/* Checkout and order pages are protected */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="about" element={<AboutPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="support/warranty" element={<WarrantyPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Admin routes */}
        {/* <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route> */}

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
