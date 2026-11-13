import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    variantId: z.string().uuid('Invalid variant ID'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    newVariantId: z.string().uuid().optional(), // In case customer changes size/color directly in cart
  }),
});

