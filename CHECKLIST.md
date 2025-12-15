# Development Checklist for Electronics Shop Web Application

This checklist translates all current-semester requirements (from the SRS/README) into actionable development tasks.  
It excludes **future scope features** (e.g., 2FA, online payments, reviews, coupons).

---

## 1. Project Setup & Core Infrastructure

- [x] **Initialize Backend:** Set up the Node.js + Express backend in `backend/`.
- [x] **Initialize Frontend:** Set up the React frontend in `frontend/`.
- [x] **Database Setup:**
  - [x] Install and configure PostgreSQL.
  - [x] Create database and tables.
  - [x] Set up environment variables in `.env`.
- [x] **Query Builder:** Set up **Knex.js** with dev/production configs.
- [x] **Migrations:** Create tables for:
  - [x] `users`
  - [x] `products`
  - [x] `orders`
  - [x] `order_items`
  - [x] `cart_items`
  - [x] `wishlists`
  - [x] `notifications`
  - [x] `support_tickets`

---

## 2. Backend Development (Node.js / Express / PostgreSQL)

### **User Management (FR1–FR4, FR15–FR17)**

- [x] **Routes:** `routes/userRoutes.js`
- [x] **Registration (FR1):**
  - [x] Validate input and enforce password complexity.
  - [x] Hash password with `bcrypt`.
  - [x] Send verification email upon registration.
- [x] **Login (FR2):**
  - [x] Validate credentials.
  - [x] Generate and return JWT.
- [x] **Session Management (FR4):**
  - [x] Middleware to verify JWT and protect routes.
- [x] **Password Reset (FR15):**
  - [x] Implement `/api/users/forgot-password` and `/api/users/reset-password/:token`.
- [x] **OTP Authentication (FR17):**
  - [x] Generate OTP on checkout and verify before confirming order.
- [x] **Profile Management (FR12):**
  - [x] Implement `/api/auth/me` for updating user info.
- [x] **Notifications (FR14):**
  - [x] Send notifications via email and store them in DB.

---

### **Product Catalog (FR5–FR7)**

- [x] **Routes:** `routes/productRoutes.js`
- [x] **Get Products (`GET /api/products`):**
  - [x] Filtering by `?featured=true`.
  - [x] Filtering by category, price, brand.
- [x] **Get Product Details (`GET /api/products/:id`):**
  - [x] Include stock, price, and images.
- [x] **Search Products:**
  - [x] Implement keyword-based search query.

---

### **Shopping Cart & Wishlist (FR8–FR13)**

- [x] **Routes:** `routes/cartRoutes.js`, `routes/wishlistRoutes.js`
- [x] **Get Cart (`GET /api/cart`)**
- [x] **Add to Cart (`POST /api/cart`)**
- [x] **Update Quantity (`PUT /api/cart/items/:id`)**
- [x] **Remove from Cart (`DELETE /api/cart/items/:id`)**
- [x] **Wishlist API (FR13):**
  - [x] Add to wishlist (`POST /api/wishlist`)
  - [x] View wishlist (`GET /api/wishlist`)
  - [x] Remove from wishlist (`DELETE /api/wishlist/:id`)

---

### **Checkout & Orders (FR9–FR11, FR10)**

- [x] **Routes:** `routes/orderRoutes.js`
- [x] **Checkout (`POST /api/orders`):**
  - [x] Accept shipping info and payment method (e.g., "Cash on Delivery").
  - [x] Generate order and move items from cart to order_items.
  - [x] Clear user cart afterward.
- [x] **Order Confirmation:**
  - [x] Use **Nodemailer** to send confirmation emails.
- [x] **Order History (`GET /api/orders`)**
  - [x] Return all orders for the current user.
- [ ] **Online Payments:**
  - [x] Add `payment_method` and `payment_details` to `orders` table.
  - [x] Create `/api/orders/create-payment-session` endpoint for Stripe.
  - [x] Create `/api/orders/webhook` endpoint to handle payment success notifications.
  - [x] Test webhook locally using Stripe CLI.

---

### **Customer Support (FR16)**

- [x] **Routes:** `routes/supportRoutes.js`
- [x] **Submit Ticket:** `POST /api/support`
- [x] **View Tickets:** `GET /api/support`
- [x] **FAQ Endpoint:** `GET /api/support/faq`

---

## 3. Staff Features (FR18–FR21)

### **Staff Authentication**

- [x] **Routes:** `routes/staffRoutes.js`
- [x] **Staff Login (FR18):** Use JWT-based role authentication.

### **Product Management (FR19)**

- [x] CRUD operations for products:
  - [x] `POST /api/staff/products`
  - [x] `PUT /api/staff/products/:id`
  - [x] `DELETE /api/staff/products/:id`
  - [x] `GET /api/staff/products` (for verification)

### **Order Management (FR20)**

- [x] View orders (`GET /api/staff/orders`)
- [x] Update status (`PUT /api/staff/orders/:id`)
- [x] Assign delivery / mark as completed

### **Customer Support (FR21)**

- [x] View support tickets (`GET /api/staff/support-tickets`)
- [x] Reply to tickets (`POST /api/staff/support-tickets/:ticketId/reply`)

---

## 4. Administrator Features (FR22–FR25)

### **Authentication**

- [x] Admin login (handled by `POST /api/users/login` with role check)
- [x] Middleware for role-based protection (`isAdmin`)

### **User Management (FR23)**

- [x] `GET /api/admin/users` (view all)
- [x] `PUT /api/admin/users/:id` (update role)
- [x] `DELETE /api/admin/users/:id` (remove)

### **Product Catalog Management (FR24)**

- [x] Create / Edit categories, featured items
- [x] Oversee all product data (CRUD with permissions)

### **Order Logs & Dashboard (FR25)**

- [x] `GET /api/admin/dashboard` — key metrics
- [x] `GET /api/admin/logs` — activity and order logs

---

## 5. Frontend Development (React)

### **Core Setup**

- [x] **Routing:** `react-router-dom`
- [x] **Styling:** Tailwind CSS
- [x] **State Management:** Redux Toolkit or Zustand
- [x] **API Service:** Centralized Axios instance

### **Pages**

#### Customer

- [x] `HomePage`, `ProductsPage`, `ProductDetailPage`
- [x] `CartPage`, `WishlistPage`, `CheckoutPage`
- [x] `OrderHistoryPage`, `LoginPage`, `RegisterPage`
- [x] `AccountPage`, `SettingsPage`, `SupportPage`

#### Staff

- [x] `StaffDashboardPage` (Consolidated into `DashboardHomePage`)
- [x] `StaffProductsPage`
- [x] `StaffOrdersPage`
- [x] `StaffSupportPage`

#### Administrator

- [x] `AdminDashboardPage` (Consolidated into `DashboardHomePage`)
- [x] `AdminUsersPage`
- [x] `AdminCategoriesPage`
- [x] `AdminAnalyticsPage`
- [x] `AdminLogsPage`

### **Reusable Components**

- [x] `ProductCard`
- [x] `Header`, `Footer`
- [x] `WishlistButton` (Functionality integrated directly into `ProductCard` and `ProductDetailPage`)
- [x] `CartSummary` (OrderSummary.jsx)
- [x] `NotificationDropdown`
- [x] `Toast/Snackbar System` (for user feedback like "Profile updated successfully")
- [x] `SupportModal` (not needed, implemented directly inside /support)

---

## 6. Functionality Implementation

- [x] **User Auth Flow:** Connect frontend with `/api/users` endpoints.
- [x] **Product Display:** Fetch and render paginated products.
- [x] **Cart Management:** Add/update/delete cart items. (Now includes robust guest-to-user sync)
- [x] **Wishlist Integration:** Sync wishlist UI with backend.
- [x] **Checkout Flow:** COD checkout with OTP verification.
- [x] **Order History:** Fetch and render past orders.
- [x] **Notifications:** Display new alerts in real-time or via polling.
- [x] **Support System:** Allow message submission and viewing.
- [x] **Role-based Access:** Protect pages by role (user, staff, admin).
- [ ] **Responsiveness (NFR5):** Ensure full mobile and tablet support.

---

## 7. Non-Functional Requirements (NFR1–NFR7)

### **Performance**

- [ ] Optimize queries and add indexes.
- [x] Lazy load product images.
- [x] Target: page load ≤ 2s, checkout ≤ 4s.

### **Scalability**

- [x] Modularize routes and services.
- [x] Use environment variables for scalable DB config.

### **Maintainability**

- [x] Organize code by feature folders.
- [x] Document API endpoints (Swagger/OpenAPI).

### **Security**

- [ ] Use HTTPS in production.
- [x] Sanitize all inputs (handled by Knex for SQLi and React for XSS).
- [x] Prevent CSRF (Double-Submit Cookie CSRF), XSS (React), and SQL (Knex) injection.
- [x] Encrypt sensitive user data.

### **Compatibility**

- [ ] Test across Chrome, Firefox, Edge, Safari.

### **Usability**

- [x] Ensure accessible UI (ARIA, tab order).
- [x] Keep checkout within 3–4 steps.

### **Reliability**

- [x] Implement error logging (Winston or similar).
- [x] Graceful API error responses. (Now with logging!)

### **Testing**

- [ ] Backend: Jest + Supertest for API routes.
- [ ] Frontend: React Testing Library + Cypress for E2E tests.

---

✅ **Goal:** When all tasks above are complete, the system will fully satisfy the SRS (excluding future scope features).

---

## 8. Future Scope / Advanced Features

This section lists tasks for future development cycles, based on the expanded requirements.

### **Enhanced Authentication**

- [x] **Social Login:**
  - [x] Implement backend routes for Google OAuth (`/api/auth/google`).
  - [x] Add Google login button to the frontend `LoginPage`.
  - [x] Implement backend routes for Facebook OAuth (`/api/auth/facebook`).
  - [x] Add Facebook login button to the frontend `LoginPage`.

### **Advanced E-Commerce Features**

- [ ] **Shipping API Integration:**
  - [ ] Backend service to get shipping rates from a provider like Giao Hàng Nhanh.
  - [ ] Display shipping options and costs in the frontend checkout flow.

### **Advanced Admin Dashboard**

- [ ] **Enhanced Analytics:** Add new dashboard components for:
  - [ ] Sales reports by product/category.
  - [ ] User purchase history and segmentation (e.g., top customers).
- [ ] **User Loyalty System:**
  - [ ] Backend logic to assign user tiers (e.g., 'premium') based on purchase history.
  - [ ] Display user status in the frontend account page and admin user list.
