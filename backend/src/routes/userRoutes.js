import { Router } from 'express';
import { getAddresses, addAddress, deleteAddress } from '../controllers/userController.js';
import { listCustomerOrders } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);
router.get('/orders', listCustomerOrders);

export default router;

