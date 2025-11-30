# Software Requirements Specification (SRS) for Electronics Shop Web Application

**GitHub Repository:** [https://github.com/your-username/your-repository-name]

## 1. Introduction

### 1.1 Objectives

The E-Commerce Web App enables online shopping by allowing users to browse, select, and purchase electronics products efficiently, while providing administrators with tools to manage electronics products and orders. The system aims to streamline the shopping experience, increase customer accessibility, ensure scalability for business growth, and lay a foundation for future enhancements like payment gateways and analytics, ultimately improving customer satisfaction and operational efficiency.

### 1.2 Scope

The application allows customers to browse electronics products, manage shopping carts, and place orders, with features for user registration, login, secure checkout using cash-on-delivery or online payments, and an admin dashboard for managing products and viewing orders. It targets customers (guests and registered users), staff (for managing products and orders), and administrators (for system oversight). The system is intended to be expandable in future semesters, beginning with a set of core features and supporting additional functionalities later.

---

## 2. Overall Description

### 2.1 User Characteristics

#### Customers

Needs: Browsing electronics products, managing shopping carts, placing orders, and tracking order statuses.  
Technical Experience: Familiar with web applications and online shopping platforms.

#### Staff

Needs: Managing product listings, processing orders, and assisting customers with inquiries.  
Technical Experience: Proficient in using internal e-commerce tools and managing product data.

#### Administrators

Needs: Overseeing system operations, managing user accounts, and ensuring platform security.  
Technical Experience: Advanced knowledge of e-commerce system management and data administration.

### 2.2 Operating Environment

The application is a browser-based, responsive web platform, accessible from desktop and mobile browsers.

### 2.3 Design and Implementation Constraints

- **Backend:** Node.js with the Express.js framework.
- **Frontend:** React with Vite. State management is handled by Redux Toolkit for global state and custom hooks for server cache state.
- **Database:** PostgreSQL.
- **Styling:** Tailwind CSS.
- **Compatibility:** Chrome, Firefox, Edge, Safari.
- **Security:** Protection against CSRF, SQL Injection, and XSS attacks.

---

## 3. System Features (Functional Requirements)

### Customer Features

- **FR1, FR2: User Registration & Login:** Create a local account with email verification or sign in using third-party providers like Google and Facebook.
- **FR5, FR6, FR7: Browse & Search Products:** Explore products by category, view featured items, and search using keywords with filters for price, category, and brand.
- **FR8, FR13: Shopping Cart & Wishlist:** Add, remove, and update items in the shopping cart. Save products to a personal wishlist for future consideration.
- **FR9, FR10, FR17: Secure Checkout:** Complete purchases using either cash-on-delivery (with OTP verification) or secure online payments via Stripe.
- **FR11, FR12, FR15: Account Management:** View order history, manage personal information, and reset passwords securely.
- **FR14, FR16: Notifications & Support:** Receive updates on order status and back-in-stock alerts. Access FAQs or submit support tickets.

---

### Staff Features

- **FR19: Advanced Product & Inventory Management:** Perform CRUD operations on products. The system includes robust stock management with atomic updates during checkout to prevent overselling.
- **FR20: Order Management:** View and update order statuses (e.g., from "Pending" to "Shipped").
- **FR21: Customer Support:** Respond to customer inquiries via a dedicated support interface.

---

### Administrator Features

- **FR23: User Management:** Create, modify, deactivate, or delete customer and staff accounts and manage their roles.
- **FR24: Catalog Management:** Oversee and update the product catalog, including managing categories.
- **FR25: Analytics Dashboard & System Monitoring:** Access a centralized dashboard to view key metrics on sales, user registrations, and order volumes. View detailed system application logs to monitor application health.

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

## 6. Future Enhancements

The following features are identified for future development cycles to enhance the platform's capabilities:

- **Shipping API Integration:** Integrate with a logistics provider (e.g., Giao Hàng Nhanh) to calculate real-time shipping fees and provide delivery tracking.
- **Alternative Payment Methods:** Integrate local payment gateways like MoMo or ZaloPay to cater to a wider user base.
- **Customer Reviews & Ratings:** Allow verified customers to submit product reviews and ratings.
- **Advanced Recommendation System:** Develop a system to provide personalized product suggestions based on user browsing history and purchase patterns.
- **Two-Factor Authentication (2FA):** Add an extra layer of security for user accounts by implementing 2FA during the login process.
- **Promotional Campaigns:** Build a module for administrators to create and manage promotional codes, discounts, and loyalty point systems.
