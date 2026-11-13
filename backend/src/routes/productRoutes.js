import { Router } from 'express';
import { 
  listProducts, 
  getProductBySlug, 
  getFeaturedProducts, 
  getNewArrivals, 
  getBestSellers, 
  getRelatedProducts 
} from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/related/:id', getRelatedProducts);
router.get('/:slug', getProductBySlug);

export default router;

