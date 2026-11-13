import { z } from 'zod';
import { INDIAN_STATES } from '../config/constants.js';

const indianPinRegex = /^[1-9][0-9]{5}$/;
const indianPhoneRegex = /^(\+91[\-\s]?)?[6789]\d{9}$/;

export const createOrderSchema = z.object({
  body: z.object({
    addressId: z.string().uuid().optional(),
    shippingAddress: z.object({
      fullName: z.string().min(2, 'Full name is required'),
      phone: z.string().regex(indianPhoneRegex, 'Please enter a valid 10-digit Indian mobile number'),
      streetAddress: z.string().min(5, 'Street address is required'),
      apartment: z.string().optional().nullable(),
      city: z.string().min(2, 'City is required'),
      state: z.string().refine(val => INDIAN_STATES.includes(val), {
        message: 'Please select a valid Indian State or Union Territory',
      }),
      postalCode: z.string().regex(indianPinRegex, 'Please provide a valid 6-digit Indian PIN code'),
      country: z.string().default('India'),
      saveAddress: z.boolean().optional().default(false),
    }).optional(),
    paymentMethod: z.enum(['RAZORPAY', 'COD']),
    couponCode: z.string().optional().nullable(),
    items: z.array(z.object({
      variantId: z.string().uuid('Invalid product variant ID'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    })).min(1, 'Order must contain at least one item'),
    notes: z.string().max(500).optional().nullable(),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    razorpayOrderId: z.string().min(1),
    razorpayPaymentId: z.string().min(1),
    razorpaySignature: z.string().min(1),
  }),
});

