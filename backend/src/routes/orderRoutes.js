import { Router } from 'express';
import { createOrder, verifyPayment, getOrderById, trackOrder } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';
import { orderLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../validators/orderValidator.js';

const router = Router();

// Public order tracking by order reference number
router.get('/track/:orderNumber', trackOrder);

// Authenticated Order operations
router.post('/create', authenticateToken, orderLimiter, validate(createOrderSchema), createOrder);
router.post('/verify-payment', authenticateToken, validate(verifyPaymentSchema), verifyPayment);
router.get('/:id', authenticateToken, getOrderById);

export default router;

