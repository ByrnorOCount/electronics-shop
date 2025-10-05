# Project Setup & Core Infrastructure

- [x] **Initialize Backend:** Set up the Node.js/Express project in the `backend` workspace.
- [x] **Initialize Frontend:** Set up the React project in the `frontend` workspace (likely with Create React App or Vite).
- [x] **Database Setup:**
  - [x] Install and configure PostgreSQL.
  - [x] Create the initial database for the application.
  - [x] Set up environment variables for database connection credentials (`.env` file).
- [x] **API Contract:** Define a basic OpenAPI/Swagger specification for the API endpoints.

## Backend Development (Node.js / Express / PostgreSQL)

### **Database & Models**

- [x] **Query Builder Setup:** Set up and configure **Knex.js**.
  - [x] Create a `knexfile.js` with development and production database connection details.
- [x] **Schema Migrations:** Use Knex to create migration files for the database schema.
  - [x] Create an initial migration for the `users` and `products` tables.
  - [ ] Create subsequent migrations for `carts`, `cart_items`, `orders`, and `order_items`.

### **User Management (FR1 - FR4)**

- [ ] **API Routes:** Create `routes/userRoutes.js`.
- [ ] **Registration Endpoint (`POST /api/users/register`):**
  - [ ] Validate input (email format, password complexity).
  - [ ] Hash password using `bcrypt`.
  - [ ] Store new user in the database.
- [ ] **Login Endpoint (`POST /api/users/login`):**
  - [ ] Validate credentials against the database.
  - [ ] Generate a JWT upon successful login.
- [ ] **Authentication Middleware:** Create middleware to verify JWTs and protect routes.

### **Product Catalog (FR5 - FR7)**

- [ ] **API Routes:** Create `routes/productRoutes.js`.
- [ ] **Get All Products (`GET /api/products`):**
  - [ ] Implement pagination.
  - [ ] Implement search by `name`.
  - [ ] Implement filtering by `category` and `price range`.
- [ ] **Get Single Product (`GET /api/products/:id`):** Fetch and return details for one product.

### **Shopping Cart (FR8 - FR11)**

- [ ] **API Routes:** Create `routes/cartRoutes.js` (protected).
- [ ] **Get Cart (`GET /api/cart`):** Retrieve the current user's cart.
- [ ] **Add to Cart (`POST /api/cart`):** Add a product to the cart or increment its quantity.
- [ ] **Update Quantity (`PUT /api/cart/items/:itemId`):** Modify the quantity of an item.
- [ ] **Remove from Cart (`DELETE /api/cart/items/:itemId`):** Remove an item from the cart.

### **Checkout & Orders (FR12 - FR15)**

- [ ] **API Routes:** Create `routes/orderRoutes.js` (protected).
- [ ] **Create Order (`POST /api/orders`):**
  - [ ] Accept shipping information.
  - [ ] Implement "Cash on Delivery" logic.
  - [ ] Create an `orders` record and move items from cart to `order_items`.
  - [ ] Clear the user's cart.
- [ ] **Order Confirmation:** Set up an email service (e.g., `Nodemailer`) to send a confirmation email.
- [ ] **Get Order History (`GET /api/orders`):** Allow a user to view their past orders.

### **Administrator Panel (FR16 - FR20)**

- [ ] **Admin Middleware:** Create middleware to check for 'Administrator' role.
- [ ] **API Routes:** Create `routes/adminRoutes.js` (protected by admin middleware).
- [ ] **Dashboard Endpoint (`GET /api/admin/dashboard`):** Aggregate and return key metrics.
- [ ] **Product Management (CRUD):**
  - [ ] `POST /api/admin/products` (Create)
  - [ ] `PUT /api/admin/products/:id` (Update)
  - [ ] `DELETE /api/admin/products/:id` (Delete)
- [ ] **Order Management:**
  - [ ] `GET /api/admin/orders` (View all orders)
  - [ ] `PUT /api/admin/orders/:id` (Update order status)
- [ ] **User Management:**
  - [ ] `GET /api/admin/users` (View all users)
  - [ ] `PUT /api/admin/users/:id` (e.g., change role)

## Frontend Development (React)

### **Core Setup**

- [x] **Routing:** Set up `react-router-dom`.
- [ ] **State Management:** Set up a state management library (e.g., Redux Toolkit, Zustand).
- [x] **API Service:** Create a centralized module for API calls.
- [x] **Styling:** Set up Tailwind CSS.

### **Component & Page Development**

- [x] **Layout:** Create a main App layout with a Navbar and Footer.
- [ ] **Pages:** `HomePage`, `ProductsPage`, `ProductDetailPage`, `LoginPage`, `RegisterPage`, `CartPage`, `CheckoutPage`, `OrderConfirmationPage`, `OrderHistoryPage`.
- [ ] **Admin Pages:** `AdminLayout`, `AdminDashboardPage`, `AdminProductsPage`, `AdminOrdersPage`, `AdminUsersPage`.
- [ ] **Reusable Components:** `ProductCard`, `Button`, `Input`, `Spinner`, `Modal`.

### **Functionality Implementation**

- [ ] **User Auth Flow:** Connect Login/Register pages to the backend and manage JWT.
- [ ] **Product Display:** Fetch and display products.
- [ ] **Shopping Cart:** Implement UI for adding, viewing, updating, and removing cart items.
- [ ] **Checkout:** Create the checkout form.
- [ ] **Protected Routes:** Create wrappers to protect routes requiring login or admin privileges.
- [ ] **Responsiveness (NFR6):** Ensure all pages are mobile-friendly.

## Non-Functional Requirements

- [ ] **Security (NFR3, NFR4):** Configure `cors`, use parameterized queries (via ORM), sanitize inputs.
- [ ] **Performance (NFR1, NFR2):** Implement code splitting, database indexing, and lazy loading for images.
- [ ] **Testing:** Write unit/integration tests for the backend and component/E2E tests for the frontend.
