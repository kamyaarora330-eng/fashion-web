import { DEFAULT_STORE_SETTINGS } from '../config/constants.js';

/**
 * Calculate totals, GST, shipping, and coupon discounts for an order
 */
export const calculateOrderTotals = ({
  items = [],
  coupon = null,
  paymentMethod = 'RAZORPAY',
  storeSettings = DEFAULT_STORE_SETTINGS,
}) => {
  // 1. Calculate items subtotal
  const subtotal = items.reduce((acc, item) => {
    const price = Number(item.unitPrice || item.price || 0);
    const qty = Number(item.quantity || 1);
    return acc + price * qty;
  }, 0);

  // 2. Calculate coupon discount if applicable
  let discount = 0;
  if (coupon && coupon.isActive) {
    const minOrder = Number(coupon.minOrderAmount || 0);
    if (subtotal >= minOrder) {
      if (coupon.discountType === 'PERCENTAGE') {
        discount = (subtotal * Number(coupon.discountValue)) / 100;
        if (coupon.maxDiscountAmount) {
          discount = Math.min(discount, Number(coupon.maxDiscountAmount));
        }
      } else if (coupon.discountType === 'FIXED') {
        discount = Math.min(Number(coupon.discountValue), subtotal);
      }
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);

  // 3. Calculate GST (Indian Goods & Services Tax)
  const gstRate = Number(storeSettings.gstPercent || DEFAULT_STORE_SETTINGS.gstPercent) / 100;
  // Prices in luxury fashion are often displayed inclusive or tax can be broken down
  // Here we calculate standard GST amount
  const tax = Number((taxableAmount * gstRate).toFixed(2));

  // 4. Calculate shipping charges
  const freeThreshold = Number(storeSettings.freeShippingThreshold || DEFAULT_STORE_SETTINGS.freeShippingThreshold);
  let shipping = 0;
  if (subtotal > 0 && subtotal < freeThreshold) {
    shipping = Number(storeSettings.standardShippingFee || DEFAULT_STORE_SETTINGS.standardShippingFee);
  }

  // 5. COD Handling Fee if applicable
  let codFee = 0;
  if (paymentMethod === 'COD' && storeSettings.codEnabled) {
    codFee = Number(storeSettings.codFee || DEFAULT_STORE_SETTINGS.codFee);
  }

  // Total payable
  const total = Number((taxableAmount + tax + shipping + codFee).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    codFee: Number(codFee.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

