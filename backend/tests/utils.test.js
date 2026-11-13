import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, comparePassword } from '../src/utils/hash.js';
import { generateToken, verifyToken } from '../src/utils/token.js';
import { generateOrderNumber } from '../src/utils/orderNumber.js';
import { calculateOrderTotals } from '../src/utils/taxCalculator.js';

describe('Security & Utility Functions Test Suite', () => {
  test('Password hashing and comparison should be secure and accurate', async () => {
    const password = 'LuxeFashion@2026';
    const hash = await hashPassword(password);
    
    assert.notEqual(hash, password);
    assert.match(hash, /^\$2[aby]\$/);
    
    const isValid = await comparePassword(password, hash);
    assert.equal(isValid, true);
    
    const isInvalid = await comparePassword('WrongPassword', hash);
    assert.equal(isInvalid, false);
  });

  test('JWT token generation and verification should decode payload correctly', () => {
    const payload = { userId: 'usr-12345', email: 'patron@modera-fashion.com', role: 'CUSTOMER' };
    const token = generateToken(payload);
    
    assert.ok(token);
    assert.equal(typeof token, 'string');
    
    const decoded = verifyToken(token);
    assert.equal(decoded.userId, payload.userId);
    assert.equal(decoded.email, payload.email);
    assert.equal(decoded.role, payload.role);
  });

  test('Order reference number should match MOD-YYYYMM-XXXXX luxury format', () => {
    const orderNumber = generateOrderNumber();
    assert.match(orderNumber, /^MOD-\d{6}-[A-F0-9]{6}$/);
  });
});

describe('Tax & Cart Order Calculations Test Suite (India Retail)', () => {
  test('Should compute subtotal, 12% GST, and standard shipping below ₹1,999 threshold', () => {
    const items = [
      { unitPrice: 1200, quantity: 1 },
    ];
    
    const totals = calculateOrderTotals({
      items,
      coupon: null,
      paymentMethod: 'RAZORPAY',
    });

    assert.equal(totals.subtotal, 1200);
    assert.equal(totals.discount, 0);
    // GST 12% of 1200 = 144
    assert.equal(totals.tax, 144);
    // Under 1999 free threshold, standard shipping is 149
    assert.equal(totals.shipping, 149);
    assert.equal(totals.codFee, 0);
    // Total = 1200 + 144 + 149 = 1493
    assert.equal(totals.total, 1493);
  });

  test('Should grant complimentary express shipping on orders exceeding ₹1,999', () => {
    const items = [
      { unitPrice: 2499, quantity: 1 },
    ];
    
    const totals = calculateOrderTotals({
      items,
      coupon: null,
      paymentMethod: 'RAZORPAY',
    });

    assert.equal(totals.subtotal, 2499);
    assert.equal(totals.shipping, 0); // Free shipping
    // GST 12% of 2499 = 299.88
    assert.equal(totals.tax, 299.88);
    assert.equal(totals.total, 2798.88);
  });

  test('Should accurately apply percentage coupon and respect maxDiscountAmount cap', () => {
    const items = [{ unitPrice: 10000, quantity: 1 }];
    const coupon = {
      isActive: true,
      discountType: 'PERCENTAGE',
      discountValue: 20, // 20% of 10000 would be 2000
      minOrderAmount: 1000,
      maxDiscountAmount: 1500, // Capped at 1500
    };

    const totals = calculateOrderTotals({ items, coupon });
    assert.equal(totals.discount, 1500); // Respects cap
  });

  test('Should add COD handling fee when Cash on Delivery is selected', () => {
    const items = [{ unitPrice: 3000, quantity: 1 }];
    const totals = calculateOrderTotals({
      items,
      paymentMethod: 'COD',
    });

    assert.equal(totals.codFee, 49);
    assert.equal(totals.shipping, 0); // > 1999 so free shipping
  });
});

