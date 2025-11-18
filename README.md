# Software Requirements Specification (SRS) for Electronics Shop Web Application

## 1. Introduction

### 1.1 Objectives

The E-Commerce Web App enables online shopping by allowing users to browse, select, and purchase electronics products efficiently, while providing administrators and staff with tools to manage products and orders.  
The system streamlines the shopping experience, increases customer accessibility, and ensures scalability for business growth, with a foundation for future enhancements like payment gateways and analytics.

### 1.2 Scope

The web application allows customers to:

- Browse and search for electronics products.
- Manage a shopping cart, wishlist, and personal account.
- Place orders and view order history.
- Staff and Administrators have dedicated portals to manage products, orders, and users.
The project is under continuous development, with a roadmap for future enhancements outlined at the end of this document.

### 1.3 Overview

Users can browse or search for products, add items to the cart, and complete purchases via a checkout process using cash-on-delivery.  
Registered users can view order history and receive notifications, while staff manage products and orders and administrators manage users and settings.

---

## 2. Overall Description

### 2.1 User Personas and Characteristics

#### Customers

- **Unregistered Customers (Guests)**: Can browse and view products; must register to purchase.  
- **Registered Customers**: Can log in, manage carts, place orders, and view order history.  

#### Staff

- Manage product listings and orders, assist customers, and update product details.  

#### Administrators

- Oversee users, staff, products, and orders, ensuring data integrity and platform security.

### 2.2 Operating Environment

The application is a browser-based, responsive web platform, accessible from desktop and mobile browsers.

### 2.3 Design and Implementation Constraints

- **Backend:** Node.js (Express.js)
- **Frontend:** React (SPA)
- **Database:** PostgreSQL
- **Compatibility:** Chrome, Firefox, Edge, Safari
- **Security:** HTTPS encryption, XSS/SQLi/CSRF protection, encrypted credentials

---

## 3. System Features (Functional Requirements)

### Customer Features

#### FR1: User Registration

Users can create accounts using name, email, password, and optional phone number. Email verification is required before activation.

#### FR2: User Login

Registered users can log in with email and password.

#### FR3: Password Hashing

Passwords are encrypted before being stored in the database.

#### FR4: Session Management

The system uses tokens (JWT) to manage sessions and protect user routes.

#### FR5: Browse Products

All electronics products are displayed in a paginated list or grid, grouped by category.

#### FR6: Search and Filter

Customers can search by keyword and filter products by price, category, or brand.

#### FR7: View Product Details

Each product displays full details including images, specifications, price, and stock status.

#### FR8: Shopping Cart Management

Customers can add, remove, or update quantities of items in their shopping cart.

#### FR9: Checkout (Cash on Delivery)

Customers provide shipping details and confirm orders via cash-on-delivery payment.

#### FR10: Order Confirmation

A confirmation page and email are sent after order placement.

#### FR11: Order History

Registered customers can view their past orders with details and statuses.

#### FR12: Account Management

Users can update profile information such as name, address, and contact details.

#### FR13: Wishlist

Customers can save products to a wishlist for future reference.

#### FR14: Notifications

Users receive order updates, stock alerts, or promotions via email or in-app alerts.

#### FR15: Password Reset

Users can reset passwords through their registered email or phone.

#### FR16: Support Requests

Users can access FAQs or submit customer support tickets.

#### FR17: OTP Authentication (Checkout Security)

Users receive one-time passwords for checkout verification to enhance security.

---

### Staff Features

#### FR18: Staff Login / Logout

Staff access the system using employee credentials.

#### FR19: Product Management

Staff perform CRUD (create, read, update, delete) operations on products, including prices and stock levels.

#### FR20: Order Management

Staff can view, process, and update order statuses (e.g., pending, shipped, delivered).

#### FR21: Customer Support

Staff respond to customer inquiries and resolve order-related issues.

---

### Administrator Features

#### FR22: Admin Login / Logout

Administrators log in with elevated privileges to oversee the system.

#### FR23: User Management

Admins can create, modify, deactivate, or delete customer and staff accounts.

#### FR24: Product Catalog Management

Admins oversee all product categories and featured items.

#### FR25: Order Log and Dashboard

Admins monitor orders and logs via a dashboard summarizing sales and activity.

---

## 4. External Interface Requirements

### 4.1 User Interface

The UI must be clean, intuitive, and responsive with clear navigation and feedback indicators.

### 4.2 Software Interfaces

Integrate an email service (e.g., Nodemailer) for notifications and confirmations.

---

## 5. Non-functional Requirements (NFR)

### NFR1: Performance

- Support 1000 concurrent users.
- Page load ≤ 2 seconds.
- Checkout process ≤ 4 seconds.

### NFR2: Scalability

Support growth in catalog size and user base without major re-architecture.

### NFR3: Maintainability

Use modular, well-documented code to simplify updates and bug fixes.

### NFR4: Security

Protect against CSRF, XSS, SQL injection; encrypt sensitive data.

### NFR5: Usability

Provide a user-friendly, mobile-responsive interface with intuitive navigation.

### NFR6: Compatibility

Ensure compatibility across modern browsers.

### NFR7: Reliability

Maintain stable performance and correct transaction handling.

---

## 6. Summary

This document serves as a living specification for the Electronics Shop Web App, outlining its features, architecture, and user roles. The project's development is ongoing, with a roadmap for planned enhancements detailed below.

---

## 7. Development Roadmap

The following features are identified for future development cycles to enhance the platform's capabilities:

### 7.1 Enhanced Authentication

- **Social Login:** Allow users to register and log in using third-party accounts like Google and Facebook.

### 7.2 Advanced E-Commerce Features

- **Payment Gateway Integration:** Integrate with payment APIs (e.g., Stripe) to enable online payments.
- **Shipping API Integration:** Connect with shipping providers (e.g., Giao Hàng Nhanh) for real-time shipping quotes and tracking.

### 7.3 Advanced Administrator Dashboard

- **Detailed Analytics:** Enhance the admin dashboard with advanced statistics on sales by product, user activity, and order trends.
- **User Loyalty System:** Implement a tier-based system (e.g., premium status) to reward frequent customers.
