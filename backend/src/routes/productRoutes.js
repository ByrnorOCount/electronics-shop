import { Router } from 'express';
import { getProducts, getProductById, getProductCategories } from '../controllers/productController.js';

const router = Router();

// GET /api/products - Get all products with optional filters
router.get('/', getProducts);

// GET /api/products/categories - Get all product categories
router.get('/categories', getProductCategories);

// GET /api/products/:id - Get a single product by ID
router.get('/:id', getProductById);

export default router;
