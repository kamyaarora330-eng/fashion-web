# MODÉRA — Luxury Fashion E-Commerce Platform

> **Artisanal Grace. Pure Silhouette.**  
> A full-stack, production-ready luxury fashion retail business targeting the Indian market with independent frontend and backend deployments.

---

## 🏛 Platform Architecture

```
MODERA/
├── frontend/               # Cloudflare Pages Deployment (React 18, Vite, Tailwind CSS)
│   ├── public/             # Static luxury brand assets, _redirects, sitemap, robots.txt
│   ├── src/
│   │   ├── components/     # Editorial Homepage, Navbar, Bag Drawer, Search, Cards
│   │   ├── pages/          # Storefront, Men, Women, PDP, Cart, Checkout, Tracking, Admin
│   │   ├── store/          # Zustand state stores (Cart, Auth, Wishlist)
│   │   ├── services/       # Axios API client with automatic JWT token attachment
│   │   ├── styles/         # Playfair Display, Cormorant Garamond, Inter design system
│   │   ├── App.jsx         # Central router (Storefront & Admin suites)
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/                # Render Web Service Deployment (Node.js, Express, PostgreSQL)
│   ├── src/
│   │   ├── config/         # Prisma DB, Cloudinary, Razorpay, India constants
│   │   ├── controllers/    # Auth, Products, Categories, Cart, Orders, Admin, Coupons
│   │   ├── middleware/     # JWT Auth, Role verification, Rate limiter, Error handler
│   │   ├── routes/         # RESTful API modules mounted under /api
│   │   ├── utils/          # Token, bcrypt hash, GST & Shipping calculators
│   │   ├── validators/     # Zod request validation schemas
│   │   └── server.js       # Production Express server (Helmet, CORS, Morgan)
│   ├── prisma/
│   │   ├── schema.prisma   # PostgreSQL Relational Schema (19 models & relations)
│   │   └── seed.js         # Realistic Indian luxury fashion catalog seed
│   ├── tests/              # Native Node.js automated test suites (9/9 passed)
│   ├── package.json
│   └── .env.example
│
├── docs/                   # Architectural blueprints & operations manuals
├── render.yaml             # Render Blueprint (Web service + Render PostgreSQL)
└── README.md
```

---

## ⚡ Mandatory Tech Stack

| Domain | Technology | Production Host |
|---|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, Zustand, React Router 7, Lucide Icons | **Cloudflare Pages** |
| **Backend** | Node.js 24, Express 4.21, Prisma ORM 5.22, JWT, bcryptjs, Zod | **Render Web Service** |
| **Database** | PostgreSQL 16 (Relational models, atomic transactions) | **Render PostgreSQL** |
| **Payments** | Razorpay (UPI, RuPay, Cards, NetBanking) + Cash on Delivery | **Razorpay Gateway** |
| **Media Storage** | Cloudinary (Responsive image delivery & CDN) | **Cloudinary** |

---

## 💎 Key Business & Platform Features

### 1. Editorial Customer Experience
- **Editorial Homepage:** Marquee announcement bar, glassmorphism navigation, hero couture banner, dual Men/Women atelier spotlights, seasonal collection carousels, patron testimonials, VIP newsletter circle.
- **Men's Fashion Atelier:** Dedicated categories (T-Shirts, Tuxedo Shirts, Jackets, Overcoats, Raw Silk Kurtas & Bundis, Trousers).
- **Women's Fashion Atelier:** Dedicated categories (Mulberry Silk Gowns, Chanderi Sarees, Linen Co-ord Sets, Poplin Tops, Sculpted Blazers).
- **Advanced Filtering & Sorting:** Multi-attribute filtering by category, size, color swatch, price slider, in-stock toggle, and sorting (Price, Newest, Popular).
- **Rich Product Detail Pages:** Multi-angle image gallery, variant selection (size & color), real-time inventory counter, size guide modal, Indian PIN code delivery estimator, and verified patron reviews.

### 2. Cart, Checkout & Indian Retail Compliance
- **Interactive Bag Drawer:** Dynamic quantity updates, variant switching, coupon code validator (`MODERA10`, `FIRST500`, `FESTIVE20`), and free shipping progress meter.
- **Indian Retail Pricing:** All amounts in Indian Rupees (INR ₹), 12% apparel GST tax breakdown, Indian 6-digit PIN code validation, all 36 Indian States & UTs.
- **Complimentary Shipping:** Automatic free express delivery on orders exceeding ₹1,999 (₹149 standard shipping below threshold).
- **Payment Flexibility:**
  - **Razorpay Integration:** Backend-created payment orders, frontend modal checkout, cryptographic HMAC SHA256 signature verification, and webhook handler.
  - **Cash on Delivery:** Automatic ₹49 handling fee application and status lifecycle.
- **Order Tracking:** Real-time consignment tracking by order reference (e.g., `MOD-202611-XXXXX`) showing progression across Confirmed → Processing → Shipped → Out for Delivery → Delivered.

### 3. Elevated Administrative Console (`/admin`)
- **Executive Analytics:** Gross revenue, total consignments, registered patrons, and low-stock alerts.
- **Product Management:** Full CRUD, image uploads, variant generator, price management, and stock adjustments.
- **Order Fulfillment:** Comprehensive consignment dashboard with carrier selection (Delhivery, Blue Dart) and airway bill tracking number assignment.
- **Patron Management:** Patron directory with order history and account status toggles.
- **Promotional Vouchers:** Campaign creation with percentage or fixed discounts, minimum spend rules, and expiry dates.
- **Store Configuration:** Dynamic GST rates, shipping thresholds, COD fees, and announcement bar text.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js v18+ and npm installed
- Git

### 1. Clone & Install Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure your DATABASE_URL in .env
npx prisma generate
node prisma/seed.js
npm run dev
```
*Backend active at `http://localhost:5000` (Swagger docs at `http://localhost:5000/api/docs`)*

### 2. Install & Run Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
*Frontend active at `http://localhost:5173`*

---

## 🧪 Automated Testing Report

Execute backend test suite:
```bash
cd backend
npm test
```

**Results:**
- `tests/utils.test.js`: Password hashing (bcrypt), JWT generation/validation, order reference format, GST & shipping calculations.
- `tests/payment.test.js`: Razorpay HMAC SHA256 signature cryptographic verification and tamper rejection.
- **Total Tests:** 9 passed, 0 failed (100% pass rate).

---

## 🌐 Production Deployment Guide

### A. Backend Deployment — Render
1. Connect your GitHub repository `modera-fashion-platform` to Render.
2. Render detects `render.yaml` automatically:
   - Provisions **Render PostgreSQL** (`modera-postgres`).
   - Provisions **Node.js Web Service** (`modera-backend`) pointing to root dir `backend`.
3. Set environment variables:
   - `DATABASE_URL`: Automatically linked from Render Postgres.
   - `JWT_SECRET`: Auto-generated random string.
   - `FRONTEND_URL`: `https://YOUR-CLOUDFLARE-PAGES-URL.pages.dev`
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: From your Razorpay dashboard.

### B. Frontend Deployment — Cloudflare Pages
1. In Cloudflare Dashboard, go to **Workers & Pages** → **Create Application** → **Pages** → **Connect to Git**.
2. Select repository: `modera-fashion-platform`.
3. Build Settings:
   - **Framework preset:** `Vite`
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Environment Variables:
   - `VITE_API_BASE_URL`: `https://modera-backend.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID`: `rzp_test_...`
5. Click **Save and Deploy**. Cloudflare automatically utilizes `public/_redirects` for SPA fallback routing.

---

## 🛡 One-Click Demonstration Logins

| Persona | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@modera-fashion.com` | `Modera@Admin2026!` | Storefront + Full `/admin` Suite |
| **Customer** | `customer@modera-fashion.com` | `Customer@123!` | Storefront + `/account` + Orders |

*(Quick one-click login buttons are also embedded on the `/auth` page for instant evaluation!)*

---

## ⚖ License & Copyright
© 2026 MODÉRA Luxury Fashion Pvt. Ltd. All rights reserved. Registered under Indian Companies Act.

