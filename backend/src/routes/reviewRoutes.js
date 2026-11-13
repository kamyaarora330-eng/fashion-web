import { Router } from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/', authenticateToken, createReview);

export default router;

