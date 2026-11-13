import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { verifyRazorpaySignature } from '../src/config/razorpay.js';

describe('Payment Security & Webhook Signature Suite', () => {
  test('Should verify legitimate Razorpay cryptographic signatures', () => {
    process.env.RAZORPAY_KEY_SECRET = 'rzp_secret_test_secret_key_889';

    const orderId = 'order_test_987654321';
    const paymentId = 'pay_test_123456789';

    // Generate expected HMAC SHA256 signature
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature,
    });

    assert.equal(isValid, true);
  });

  test('Should strictly reject tampered or forged payment signatures', () => {
    process.env.RAZORPAY_KEY_SECRET = 'rzp_secret_test_secret_key_889';

    const orderId = 'order_test_987654321';
    const paymentId = 'pay_test_123456789';
    const fakeSignature = 'tampered_fake_signature_hash_0000000000000000';

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: fakeSignature,
    });

    assert.equal(isValid, false);
  });
});

