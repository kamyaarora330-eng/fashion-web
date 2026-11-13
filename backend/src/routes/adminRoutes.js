import { Router } from 'express';
import multer from 'multer';
import { 
  getDashboardStats,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUpdateInventory,
  adminListOrders,
  adminUpdateOrderStatus,
  adminListCustomers,
  adminToggleCustomerStatus,
  adminCreateCoupon,
  adminListCoupons,
  adminGetSettings,
  adminUpdateSettings,
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProductSchema } from '../validators/productValidator.js';
import { createCouponSchema } from '../validators/couponValidator.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

const router = Router();

// Enforce admin permissions on the backend
router.use(authenticateToken);
router.use(requireAdmin);

// Analytics
router.get('/stats', getDashboardStats);

// Product Management
router.post('/products', validate(createProductSchema), adminCreateProduct);
router.patch('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);
router.patch('/inventory/:variantId', adminUpdateInventory);

// Orders Management
router.get('/orders', adminListOrders);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

// Customers Management
router.get('/customers', adminListCustomers);
router.patch('/customers/:id/toggle-status', adminToggleCustomerStatus);

// Coupons Management
router.get('/coupons', adminListCoupons);
router.post('/coupons', validate(createCouponSchema), adminCreateCoupon);

// Settings
router.get('/settings', adminGetSettings);
router.put('/settings', adminUpdateSettings);

// Image Upload Endpoint via Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    if (isCloudinaryConfigured) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'modera/products',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const result = await uploadPromise;

      return res.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      });
    } else {
      // Fallback base64 data URL if Cloudinary credentials not configured yet
      const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      return res.json({
        success: true,
        data: {
          url: base64Data,
          publicId: `local-${Date.now()}`,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;

