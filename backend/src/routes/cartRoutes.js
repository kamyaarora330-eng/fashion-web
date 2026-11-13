import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { addToCartSchema, updateCartItemSchema } from '../validators/cartValidator.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getCart);
router.post('/add', validate(addToCartSchema), addToCart);
router.patch('/item/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/item/:itemId', removeCartItem);
router.delete('/clear', clearCart);

export default router;

