import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import cartRoutes from './cartRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import couponRoutes from './couponRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import newsletterRoutes from './newsletterRoutes.js';
import adminRoutes from './adminRoutes.js';
import prisma from '../config/database.js';

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  let dbStatus = 'healthy';
  try {
    // Quick probe
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'degraded_or_reconnecting';
  }

  res.json({
    status: 'ok',
    brand: 'MODÉRA Luxury Fashion Platform',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Mount module routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/admin', adminRoutes);

export default router;

