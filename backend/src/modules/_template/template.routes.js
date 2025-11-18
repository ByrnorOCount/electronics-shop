import express from "express";
import * as templateController from "./template.controller.js";
import * as templateValidation from "./template.validation.js";
import {
  authenticate,
  isAuthenticated,
} from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";
const router = express.Router();

router
  .route("/")
  // Example of a protected route
  .post(
    authenticate,
    isAuthenticated,
    validate(templateValidation.createItem),
    templateController.createItem
  )
  // Example of a public route
  .get(templateController.getAllItems);

export default router;
