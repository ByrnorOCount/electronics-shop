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

## 2. Backend Development (Node.js / Express / PostgreSQL) - **[PRIORITY: API First]**

### **User Management (FR1–FR4, FR15–FR17)**

- [x] **Routes:** `routes/userRoutes.js`
- [x] **Registration (FR1):**
  - [ ] Validate input and enforce password complexity.
  - [x] Hash password with `bcrypt`.
  - [x] Send verification email upon registration.
- [x] **Login (FR2):**
  - [x] Validate credentials.
  - [x] Generate and return JWT.
- [x] **Session Management (FR4):**
  - [x] Middleware to verify JWT and protect routes.
- [x] **Password Reset (FR15):**
  - [x] Implement `/api/users/forgot-password` and `/api/users/reset-password/:token`.
- [ ] **OTP Authentication (FR17):**
  - [ ] Generate OTP on checkout and verify before confirming order.
- [x] **Profile Management (FR12):**
  - [x] Implement `/api/users/me` for updating user info.
- [ ] **Notifications (FR14):**
  - [ ] Send notifications via email and store them in DB.

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
  - [x] Accept shipping info and use “Cash on Delivery”.
  - [x] Generate order and move items from cart to order_items.
  - [x] Clear user cart afterward.
- [x] **Order Confirmation:**
  - [x] Use **Nodemailer** to send confirmation emails.
- [x] **Order History (`GET /api/orders`)**
  - [x] Return all orders for the current user.

---

### **Customer Support (FR16)**

- [x] **Routes:** `routes/supportRoutes.js`
- [x] **Submit Ticket:** `POST /api/support`
- [x] **View Tickets:** `GET /api/support`
- [x] **FAQ Endpoint:** `GET /api/support/faq`

---

## 3. Staff Features (FR18–FR21) - **[PRIORITY: API First]**

### **Staff Authentication**

- [ ] **Routes:** `routes/staffRoutes.js`
- [x] **Staff Login (FR18):** Use JWT-based role authentication.

### **Product Management (FR19)**

- [x] CRUD operations for products:
  - [x] `POST /api/staff/products`
  - [x] `PUT /api/staff/products/:id`
  - [x] `DELETE /api/staff/products/:id`
  - [ ] `GET /api/staff/products` (for verification)

### **Order Management (FR20)**

- [x] View orders (`GET /api/staff/orders`)
- [x] Update status (`PUT /api/staff/orders/:id`)
- [ ] Assign delivery / mark as completed

### **Customer Support (FR21)**

- [x] View support tickets (`GET /api/staff/support-tickets`)
- [ ] Reply to tickets (`POST /api/staff/support/reply`)

---

## 4. Administrator Features (FR22–FR25) - **[PRIORITY: API First]**

### **Authentication**

- [x] Admin login (handled by `POST /api/users/login` with role check)
- [x] Middleware for role-based protection (`isAdmin`)

### **User Management (FR23)**

- [x] `GET /api/admin/users` (view all)
- [x] `PUT /api/admin/users/:id` (update role)
- [x] `DELETE /api/admin/users/:id` (remove)

### **Product Catalog Management (FR24)**

- [ ] Create / Edit categories, featured items
- [ ] Oversee all product data (CRUD with permissions)

### **Order Logs & Dashboard (FR25)**

- [ ] `GET /api/admin/dashboard` — key metrics
- [ ] `GET /api/admin/logs` — activity and order logs

---

## 5. Frontend Development (React)

### **Core Setup**

- [x] **Routing:** `react-router-dom`
- [x] **Styling:** Tailwind CSS
- [ ] **State Management:** Redux Toolkit or Zustand
- [x] **API Service:** Centralized Axios instance

### **Pages**

#### Customer

- [ ] `HomePage`, `ProductsPage`, `ProductDetailPage`
- [ ] `CartPage`, `WishlistPage`, `CheckoutPage`
- [x] `OrderHistoryPage`, `LoginPage`, `RegisterPage`
- [ ] `AccountPage`, `SupportPage`

#### Staff

- [ ] `StaffDashboardPage`
- [ ] `StaffProductsPage`
- [ ] `StaffOrdersPage`
- [ ] `StaffSupportPage`

#### Administrator

- [ ] `AdminDashboardPage`
- [ ] `AdminUsersPage`
- [ ] `AdminProductsPage`
- [ ] `AdminOrdersPage`
- [ ] `AdminLogsPage`

### **Reusable Components**

- [x] `ProductCard`
- [x] `Navbar`, `Footer`
- [ ] `WishlistButton`
- [ ] `CartSummary`
- [ ] `NotificationDropdown`
- [ ] `SupportModal`

---

## 6. Functionality Implementation

- [x] **User Auth Flow:** Connect frontend with `/api/users` endpoints.
- [x] **Product Display:** Fetch and render paginated products.
- [x] **Cart Management:** Add/update/delete cart items.
- [ ] **Wishlist Integration:** Sync wishlist UI with backend.
- [ ] **Checkout Flow:** COD checkout with OTP verification.
- [ ] **Order History:** Fetch and render past orders.
- [ ] **Notifications:** Display new alerts in real-time or via polling.
- [ ] **Support System:** Allow message submission and viewing.
- [ ] **Role-based Access:** Protect pages by role (user, staff, admin).
- [ ] **Responsiveness (NFR5):** Ensure full mobile and tablet support.

---

## 7. Non-Functional Requirements (NFR1–NFR7)

### **Performance**

- [ ] Optimize queries and add indexes.
- [ ] Lazy load product images.
- [ ] Target: page load ≤ 2s, checkout ≤ 4s.

### **Scalability**

- [ ] Modularize routes and services.
- [ ] Use environment variables for scalable DB config.

### **Maintainability**

- [ ] Organize code by feature folders.
- [ ] Document API endpoints (Swagger/OpenAPI).

### **Security**

- [ ] Use HTTPS in production.
- [ ] Sanitize all inputs.
- [ ] Prevent CSRF, XSS, and SQL injection.
- [ ] Encrypt sensitive user data.

### **Compatibility**

- [ ] Test across Chrome, Firefox, Edge, Safari.

### **Usability**

- [ ] Ensure accessible UI (ARIA, tab order).
- [ ] Keep checkout within 3–4 steps.

### **Reliability**

- [ ] Implement error logging (Winston or similar).
- [ ] Graceful API error responses.

### **Testing**

- [ ] Backend: Jest + Supertest for API routes.
- [ ] Frontend: React Testing Library + Cypress for E2E tests.

---

✅ **Goal:** When all tasks above are complete, the system will fully satisfy the SRS (excluding future scope features).
