# MODÉRA Production Deployment & Configuration Guide

This guide details the step-by-step procedure for deploying the MODÉRA luxury fashion platform across its two independent production environments: **Render** (Backend & PostgreSQL) and **Cloudflare Pages** (Frontend).

---

## 1. Environment Variables Matrix

### Backend (`backend/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | Listening server port | `10000` (Render default) |
| `FRONTEND_URL` | Cloudflare Pages production origin for CORS | `https://modera.pages.dev` |
| `DATABASE_URL` | Render PostgreSQL internal or external connection string | `postgresql://user:pass@host:5432/modera_db?sslmode=require` |
| `JWT_SECRET` | 32+ character secret for token signatures | `modera_production_jwt_secret_token_...` |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |
| `RAZORPAY_KEY_ID` | Razorpay Merchant Key ID | `rzp_live_...` or `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Merchant Key Secret | Generated in Razorpay Dashboard |
| `RAZORPAY_WEBHOOK_SECRET`| Razorpay Webhook signature secret | Configured under Webhooks in Razorpay |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | `modera-fashion` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `1234567890` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Secret string |
| `ADMIN_BOOTSTRAP_SECRET`| One-time initial admin initialization token | High entropy key |

### Frontend (`frontend/.env`)
| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_BASE_URL` | Public Render backend API base | `https://modera-backend.onrender.com/api` |
| `VITE_RAZORPAY_KEY_ID` | Client-facing Razorpay Key ID | `rzp_live_...` or `rzp_test_...` |

---

## 2. Render Deployment (Backend & PostgreSQL Database)

### Option A: Automatic via Render Blueprint (`render.yaml`)
1. In the Render Dashboard, select **New** → **Blueprint**.
2. Select repository: `modera-fashion-platform`.
3. Render automatically reads `render.yaml` at the root, provisioning:
   - `modera-postgres` database (PostgreSQL 16).
   - `modera-backend` web service pointing to `rootDir: backend`.
4. Render injects the database connection string automatically into `DATABASE_URL`.
5. Enter your `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `FRONTEND_URL`.
6. Click **Apply**. Render runs:
   ```bash
   npm ci && npx prisma generate && npx prisma migrate deploy
   ```
   and starts the server using `npm run start`.
7. Once active, verify health:
   ```bash
   curl https://YOUR-RENDER-BACKEND-URL.onrender.com/api/health
   ```

### Option B: Manual Service Creation on Render
- **PostgreSQL Database:**
  - Name: `modera-postgres`
  - Region: `Singapore` (optimal latency for India)
- **Web Service:**
  - Root directory: `backend`
  - Environment: `Node`
  - Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
  - Start command: `node src/server.js`
  - Health check path: `/api/health`

---

## 3. Cloudflare Pages Deployment (Frontend)

1. Navigate to **Cloudflare Dashboard** → **Workers & Pages** → **Create Application** → **Pages**.
2. Link your GitHub account and select repository: `modera-fashion-platform`.
3. Configure the Build settings:
   - **Framework Preset:** `Vite`
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://YOUR-RENDER-BACKEND.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID` = `rzp_test_...` or `rzp_live_...`
5. Click **Save and Deploy**.
6. Cloudflare builds the React bundle and deploys across its global edge network.
7. The included `public/_redirects` file (`/* /index.html 200`) handles client-side React Router navigation for deep links.

---

## 4. Initial Database Seeding & Admin Setup

To seed the catalog on Render PostgreSQL:
```bash
# From Render Shell or locally pointing DATABASE_URL to Render Postgres
npx prisma db seed
# or
node prisma/seed.js
```

Default seeded administrator credentials:
- **Email:** `admin@modera-fashion.com`
- **Password:** `Modera@Admin2026!`

Alternatively, call the secure bootstrap endpoint with your `ADMIN_BOOTSTRAP_SECRET`:
```bash
POST /api/auth/bootstrap-admin
Content-Type: application/json

{
  "secret": "modera_secure_bootstrap_key_2026",
  "email": "owner@modera-fashion.com",
  "password": "SecurePassword123!",
  "firstName": "Store",
  "lastName": "Director"
}
```

