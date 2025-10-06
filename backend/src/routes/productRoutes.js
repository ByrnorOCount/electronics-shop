import { Router } from 'express';
import { getProducts } from '../controllers/productController.js';

const router = Router();

// GET /api/products
// GET /api/products?featured=true
router.get('/', getProducts);

export default router;
