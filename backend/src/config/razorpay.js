import Razorpay from 'razorpay';
import crypto from 'crypto';

const isRazorpayConfigured = 
  process.env.RAZORPAY_KEY_ID && 
  process.env.RAZORPAY_KEY_SECRET;

let razorpayClient = null;

if (isRazorpayConfigured) {
  razorpayClient = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('[MODÉRA] Razorpay keys not provided in environment. Payment orders will require keys before live payment processing.');
}

/**
 * Verify Razorpay payment signature
 * HMAC SHA256 using razorpay_order_id + "|" + razorpay_payment_id
 */
export const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay secret key is missing from environment.');
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

export { razorpayClient, isRazorpayConfigured };

