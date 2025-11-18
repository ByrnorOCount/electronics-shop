/**
 * Barrel file for API services.
 * This file re-exports all service modules, allowing for cleaner imports
 * in other parts of the application.
 *
 * Instead of:
 * import authService from '../features/auth/authService';
 * import productService from '../features/products/productService';
 *
 * You can do:
 * import { authService, productService } from '../api';
 */
export { default as adminService } from "../features/admin/adminService";
export { default as authService } from "../features/auth/authService";
export { default as cartService } from "../features/cart/cartService";
export { default as orderService } from "../features/checkout-orders/orderService";
export { default as notificationService } from "../features/notifications/notificationService";
export { default as productService } from "../features/products/productService";
export { default as userService } from "../features/user/userService";
export { default as supportService } from "../features/support/supportService";
export { default as wishlistService } from "../features/wishlist/wishlistService";
