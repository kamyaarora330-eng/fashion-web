import { z } from 'zod';

const indianPhoneRegex = /^(\+91[\-\s]?)?[6789]\d{9}$/;

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phone: z.string().regex(indianPhoneRegex, 'Please provide a valid 10-digit Indian mobile number').optional().nullable(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: z.string().regex(indianPhoneRegex, 'Please provide a valid 10-digit Indian mobile number').optional().nullable(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

