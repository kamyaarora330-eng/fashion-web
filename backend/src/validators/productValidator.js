import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Product name is required'),
    sku: z.string().min(3, 'SKU is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    details: z.string().optional(),
    gender: z.enum(['MEN', 'WOMEN', 'UNISEX']),
    categoryId: z.string().uuid('Invalid Category ID'),
    originalPrice: z.number().positive('Original price must be greater than 0'),
    sellingPrice: z.number().positive('Selling price must be greater than 0'),
    discountPercent: z.number().min(0).max(100).optional().default(0),
    isFeatured: z.boolean().optional().default(false),
    isNewArrival: z.boolean().optional().default(false),
    isBestSeller: z.boolean().optional().default(false),
    status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional().default('ACTIVE'),
    sizeChartUrl: z.string().url().optional().nullable(),
    variants: z.array(z.object({
      size: z.string(),
      colorName: z.string(),
      colorHex: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid Hex Color'),
      sku: z.string(),
      additionalPrice: z.number().min(0).optional().default(0),
      quantity: z.number().int().min(0).default(10),
      lowStockThreshold: z.number().int().min(0).optional().default(5),
    })).min(1, 'At least one variant (size & color) is required'),
    images: z.array(z.object({
      url: z.string().url(),
      publicId: z.string().optional(),
      altText: z.string().optional(),
      displayOrder: z.number().int().optional().default(0),
      isThumbnail: z.boolean().optional().default(false),
    })).min(1, 'At least one product image is required'),
  }),
});

export const productQuerySchema = z.object({
  query: z.object({
    gender: z.enum(['MEN', 'WOMEN', 'UNISEX']).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular', 'rating']).optional(),
    isFeatured: z.string().optional(),
    isNewArrival: z.string().optional(),
    isBestSeller: z.string().optional(),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('12'),
  }),
});

