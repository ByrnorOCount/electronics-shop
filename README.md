# Software Requirements Specification (SRS) for Electronics Shop Web Application

## 1. Introduction

### 1.1 Objectives

The E-Commerce Web App enables online shopping by allowing users to browse, select, and purchase electronics products efficiently, while providing administrators with tools to manage electronics products and orders. The system aims to streamline the shopping experience, increase customer accessibility, ensure scalability for business growth, and lay a foundation for future enhancements like payment gateways and analytics, ultimately improving customer satisfaction and operational efficiency.

### 1.2 Scope

The application allows customers to browse electronics products, manage shopping carts, and place orders, with features for user registration, login, basic checkout using cash-on-delivery, and an admin dashboard for managing electronics products and viewing orders. It targets customers (guests and registered users), staff (for managing electronics products and orders), and administrators (for system oversight). The system is intended to be expandable in future semesters, beginning with a set of core features and supporting additional functionalities later.

### 1.3 Overview

The system enables customers to browse products by category or search, add items to a cart, and complete purchases via a checkout process with cash-on-delivery. Registered users can save details and view order history, staff manage products and orders, and admins control system settings. The workflow involves customers browsing products, adding to the cart, proceeding to checkout, selecting payment, confirming the order, and receiving confirmation and shipping details.

---

## 2. Overall Description

### 2.1 User Personas and Characteristics

#### Customer

| Characteristic  | Description                                           |
| :-------------- | :---------------------------------------------------- |
| **User Type**   | General users who browse and purchase products.       |
| **Permissions** | View products, add to cart, checkout, view order history. |

#### Administrator

| Characteristic  | Description                                                              |
| :-------------- | :----------------------------------------------------------------------- |
| **User Type**   | Staff responsible for managing the platform's content and operations.    |
| **Permissions** | Full CRUD (Create, Read, Update, Delete) access on products, orders, and users. |

### 2.2 Operating Environment

The application will be a web-based platform hosted on a cloud service (e.g., AWS, Google Cloud, Azure). It must be accessible via modern web browsers on both desktop and mobile devices.

### 2.3 Design and Implementation Constraints

- The backend will be built using **Node.js** with the **Express.js** framework.
- The frontend will be a single-page application (SPA) built with **React**.
- The database will be **PostgreSQL**.
- The user interface must be responsive and adhere to modern web design principles.

---

## 3. System Features (Functional Requirements)

### 3.1 User Management

- **FR1: User Registration:** Users must be able to create a new account using an email and password.
- **FR2: User Login:** Registered users must be able to log in with their credentials.
- **FR3: Password Hashing:** User passwords must be securely hashed before being stored in the database.
- **FR4: Session Management:** The system shall use tokens (e.g., JWT) to manage user sessions.

### 3.2 Product Catalog

- **FR5: Product Display:** All available products shall be displayed in a grid or list format, showing at least the product image, name, and price.
- **FR6: Product Details:** Clicking on a product shall navigate the user to a detailed view showing full description, specifications, and images.
- **FR7: Product Search & Filter:** Users must be able to search for products by name and filter them by category and price range.

### 3.3 Shopping Cart

- **FR8: Add to Cart:** Users can add products to their shopping cart from the product list or detail page.
- **FR9: View Cart:** Users can view the contents of their cart, including items, quantities, and subtotal.
- **FR10: Update Quantity:** Users can change the quantity of items in their cart.
- **FR11: Remove from Cart:** Users can remove items from their cart.

### 3.4 Checkout and Order

- **FR12: Checkout Process:** Users must provide shipping information to proceed with checkout.
- **FR13: Payment Method:** The system will initially support a "Cash on Delivery" payment option.
- **FR14: Order Confirmation:** After placing an order, the user will see an order confirmation page and receive a confirmation email.
- **FR15: Order History:** Logged-in users can view their past orders and their statuses (e.g., Processing, Shipped, Delivered).

### 3.5 Administrator Panel

- **FR16: Secure Access:** The admin panel must be accessible only to users with 'Administrator' roles.
- **FR17: Dashboard:** The admin dashboard will display key metrics like total sales, new orders, and new user registrations.
- **FR18: Product Management:** Admins can add, update, and delete products from the catalog.
- **FR19: Order Management:** Admins can view all orders and update their status.
- **FR20: User Management:** Admins can view and manage all registered users.

---

## 4. External Interface Requirements

### 4.1 User Interface

- The UI must be clean, intuitive, and responsive, providing a seamless experience on devices ranging from mobile phones to desktops.
- All interactive elements must have clear visual feedback (e.g., hover states, loading indicators).

### 4.2 Software Interfaces

- **Payment Gateway API:** The system will interface with a secure payment gateway's API for processing transactions. All communication must be encrypted.

---

## 5. Non-functional Requirements

### 5.1 Performance

- **NFR1:** All pages must have a load time of under 3 seconds on a standard broadband connection.
- **NFR2:** API response times for critical actions (e.g., add to cart, fetch products) should be under 500ms.

### 5.2 Security

- **NFR3:** The application must be protected against common web vulnerabilities, including Cross-Site Scripting (XSS), SQL Injection, and Cross-Site Request Forgery (CSRF).
- **NFR4:** All data transmission between the client and server must be encrypted using HTTPS.

### 5.3 Reliability

- **NFR5:** The application should have an uptime of 99.9%.

### 5.4 Usability

- **NFR6:** The user journey from browsing to checkout should be completable in a minimal number of steps and be intuitive for non-technical users.
