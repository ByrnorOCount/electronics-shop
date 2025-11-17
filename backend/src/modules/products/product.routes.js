import { Router } from "express";
import {
  getProducts,
  getProductById,
  getProductCategories,
} from "./product.controller.js";
import validate from "../../core/middlewares/validation.middleware.js";
import * as productValidation from "./product.validation.js";

const router = Router();

// GET /api/products - Get all products with optional filters
router.get("/", validate(productValidation.getProducts), getProducts);

// GET /api/products/categories - Get all product categories
router.get("/categories", getProductCategories);

// GET /api/products/:id - Get a single product by ID
router.get("/:id", validate(productValidation.getProductById), getProductById);

export default router;
