// Old GHN shit, planned to be replaced with GHTK
import express from "express";
import { calculateFee } from "./shipping.controller.js";
import {
  authenticate,
  isAuthenticated,
} from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";
import * as shippingValidation from "./shipping.validation.js";

const router = express.Router();

router.use(authenticate, isAuthenticated);

router.post(
  "/calculate-fee",
  validate(shippingValidation.calculateFee),
  calculateFee
);

export default router;
