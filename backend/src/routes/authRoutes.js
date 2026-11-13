import { Router } from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  changePassword, 
  forgotPassword, 
  bootstrapAdmin 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema, 
  changePasswordSchema 
} from '../validators/authValidator.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', authenticateToken, getMe);
router.patch('/profile', authenticateToken, validate(updateProfileSchema), updateProfile);
router.post('/change-password', authenticateToken, validate(changePasswordSchema), changePassword);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/bootstrap-admin', authLimiter, bootstrapAdmin);

export default router;

