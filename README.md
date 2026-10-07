# Smoke Time Store

A full-featured e-commerce storefront for premium tobacco and smoke products, targeting the South African market. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

---

## Features

- **Product Catalog**: Category filtering, live search, sorting, and pagination.
- **Bulk & Wholesale Pricing Tiers**: Automatic tier recalculation based on quantity thresholds for approved bulk buyers.
- **Role-Based Access Control**:
  - **Retail / Guest**: Browse catalog, add items to cart, wishlist, and place orders.
  - **Bulk Buyer**: Access to wholesale application flow, tiered bulk pricing, and bulk dashboard with quick-order SKU entry.
  - **Admin**: Full dashboard analytics, order status management, inventory management, bulk buyer registration approvals, and live content CMS.
- **Shopping Cart & VAT**: Real-time subtotal, 15% South African VAT calculation, total amount, and bulk savings counter.
- **Wishlist & Recently Viewed**: Dynamic localStorage persistence for saved products and browsing history.
- **Order Confirmation & Invoicing**: Interactive checkout validation, order summary, and printable admin invoices.
- **Admin Analytics & CMS**: Visual revenue charts (Recharts), low-stock alerts, pending action indicators, and live hero/banner text updates via `contentStore`.
- **Security**: Password hashing powered by `bcryptjs` with salted rounds.

---

## Tech Stack

| Technology | Purpose / Usage |
| --- | --- |
| **Next.js 16 (App Router)** | Core Framework & Server-Side Rendering |
| **TypeScript** | Type-Safe Architecture & Domain Modeling |
| **Zustand v5** | State Management (Auth, Cart, Wishlist, CMS, Reviews) |
| **Tailwind CSS v4** | Utility-First Responsive Styling |
| **Radix UI / shadcn-ui** | Accessible UI Component Primitives |
| **Framer Motion** | Micro-interactions, Transitions & Animations |
| **Zod v4** | Schema Validation for Forms & Data |
| **React Hook Form** | High-Performance Form Handling |
| **Recharts** | Admin Dashboard Analytics & Visualizations |
| **Sonner** | Toast Notifications |

---

## Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sad1kul/store-front-end.git
   cd store-front-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Demo Credentials

Use any of the preset demo accounts to test role-specific features. A floating **DevTools Role Switcher** is also available at the bottom-right corner during development.

| Role | Email | Password | Access Capabilities |
| --- | --- | --- | --- |
| **Admin** | `admin@smoketimestore.co.za` | `admin123` | Full admin dashboard (`/admin`), product/order management, approvals, CMS |
| **Approved Bulk Buyer** | `sipho@smokeworld.co.za` | `bulk123` | Wholesale tiered pricing, bulk buyer dashboard (`/dashboard`), quick orders |
| **Retail User** | `thabo@example.co.za` | `user123` | Standard retail storefront shopping, wishlist, cart & checkout |

---

## Project Structure

```text
store-front-end/
├── app/                        # Next.js App Router pages and dynamic routes
│   ├── admin/                  # Admin dashboard, products, orders, users, approvals, CMS
│   ├── cart/                   # Shopping cart page
│   ├── checkout/               # Multi-step checkout page
│   ├── dashboard/              # Bulk buyer dashboard & quick-order interface
│   ├── login/                  # User login page
│   ├── products/               # Product catalog & single product details
│   ├── register/               # Retail & wholesale application registration forms
│   └── wishlist/               # Saved wishlist page
├── components/                 # Reusable UI & layout components
│   ├── admin/                  # Admin widgets and stat cards
│   ├── cart/                   # Cart item rows and summary elements
│   ├── layout/                 # Navbar, Footer, Hero, Banners, Badges, Search
│   ├── products/               # Product cards, review forms, bulk tables, recently viewed
│   ├── shared/                 # Age gate, role switcher, status badges, skeletons
│   └── ui/                     # Radix / shadcn-ui primitive components
├── lib/                        # Core application logic & data stores
│   ├── mock-data/              # Seed JSON data (products, users, orders, applications)
│   ├── store/                  # Zustand state management stores
│   ├── types/                  # TypeScript interface definitions (Product, Order, User, etc.)
│   ├── utils/                  # Utility helpers (currency formatting, recently viewed, cn)
│   └── validations/            # Zod validation schemas
├── public/                     # Static assets and icons
├── README.md                   # Project documentation
├── .env.example                # Sample environment variables
└── next.config.ts              # Next.js configuration (remote image patterns)
```
