import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import logger from "./utils/logger";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/home/HomePage";
import api from "./api/axios";
import ProductsPage from "./features/products/ProductsPage";
import ProductDetailPage from "./features/products/ProductDetailPage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import SupportPage from "./features/support/SupportPage";
import TicketDetailPage from "./features/support/TicketDetailPage";
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
import StaffLayout from "./features/staff/components/StaffLayout";
import StaffDashboardPage from "./features/staff/StaffDashboardPage";
import StaffSupportPage from "./features/staff/StaffSupportPage";
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
    logger.error("Failed to fetch CSRF token:", error);
  }
};

function App() {
  // Fetch the CSRF token when the application first loads.
  // This ensures that subsequent state-changing API calls (POST, PUT, DELETE)
  // will have the necessary token to pass the backend's security check.
  useEffect(() => {
    // Clean up the URL if it contains the Facebook OAuth redirect artifact.
    if (window.location.hash && window.location.hash === "#_=_") {
      // Use replaceState to remove the hash from the URL without reloading the page.
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname + window.location.search
      );
    }

    initializeCsrf();
  }, []);
  return (
    <>
      <CartSyncManager />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* The root Outlet no longer needs to provide context for the modal */}
        <Route path="/" element={<Outlet />}>
          <Route element={<Layout />}>
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
            <Route
              path="support/ticket/:ticketId"
              element={
                <ProtectedRoute>
                  <TicketDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="support/warranty" element={<WarrantyPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        {/* Staff routes */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute roles={["staff", "admin"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboardPage />} />
          <Route path="support" element={<StaffSupportPage />} />
        </Route>

        {/* Admin routes */}
        {/* <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route> */}
      </Routes>
    </>
  );
}

export default App;
