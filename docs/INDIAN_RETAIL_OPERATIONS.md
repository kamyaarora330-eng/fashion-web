# MODÉRA — Indian E-Commerce Operational Blueprint

## 1. Currency & Taxation Architecture (GST)
- **Currency:** Indian Rupee (INR ₹), formatted with Indian numbering standard (e.g. `₹1,999`, `₹14,999`, `₹1,49,999`).
- **GST Rate:** Configurable via Admin Settings (`StoreSettings.gstPercent`). Standard apparel tax is pre-configured at 12%.
- **Tax Breakdown:** Automatically computed on subtotal less discounts during cart & checkout calculations.
- **Tax Invoices:** Tax invoices display HSN codes and breakdown of CGST + SGST (intra-state) or IGST (inter-state).

## 2. Pincode & Address Standards
- **PIN Code Validation:** Enforces strict Indian 6-digit postal index number regex (`^[1-9][0-9]{5}$`).
- **States & Union Territories:** Complete enumeration of all 36 Indian States and Union Territories.
- **Mobile Validation:** Validates 10-digit Indian mobile numbers (`^(\+91[\-\s]?)?[6789]\d{9}$`) required for OTP and courier delivery notifications.

## 3. Payment Aggregation (Razorpay & COD)
- **Razorpay Flow:**
  1. Frontend submits order intent to `/api/orders/create`.
  2. Backend calculates totals, checks stock concurrency, creates order, and requests order creation from Razorpay API (`amount` in paise).
  3. Frontend opens native Razorpay checkout modal with generated order ID.
  4. Upon patron completion, frontend submits `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to `/api/orders/verify-payment`.
  5. Backend generates expected HMAC SHA256 signature using `RAZORPAY_KEY_SECRET` and verifies authenticity before updating order status to `CONFIRMED`.
- **Cash on Delivery (COD):**
  - Configurable fee (`codFee`: ₹49).
  - Can be toggled on or off instantly from the Admin Console.
  - Generates verified order with payment status `PENDING` until doorstep collection.

## 4. Shipping & Logistics Integrations
- Prepared integration hooks for leading Indian logistics providers:
  - **Delhivery Express:** Surface & Air express.
  - **Blue Dart Apex:** Air express for metropolitan corridors.
- Consignment tracking with live progress timeline across:
  `CONFIRMED` → `PROCESSING` → `SHIPPED` → `OUT_FOR_DELIVERY` → `DELIVERED`.

