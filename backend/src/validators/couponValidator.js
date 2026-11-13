import { z } from 'zod';

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code is required').trim().toUpperCase(),
    orderAmount: z.number().positive('Order amount must be positive'),
  }),
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3).trim().toUpperCase(),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.number().positive(),
    minOrderAmount: z.number().min(0).default(0),
    maxDiscountAmount: z.number().positive().optional().nullable(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime(),
    usageLimit: z.number().int().positive().optional().nullable(),
    isActive: z.boolean().default(true),
  }),
});

