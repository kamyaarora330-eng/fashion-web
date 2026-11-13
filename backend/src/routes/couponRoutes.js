import { Router } from 'express';
import { validateCoupon, listPublicCoupons } from '../controllers/couponController.js';
import { validate } from '../middleware/validate.js';
import { validateCouponSchema } from '../validators/couponValidator.js';

const router = Router();

router.get('/', listPublicCoupons);
router.post('/validate', validate(validateCouponSchema), validateCoupon);

export default router;

