import express from "express";
import * as templateController from "./template.controller.js";
import * as templateValidation from "./template.validation.js";
import { authenticate } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticate,
    validate(templateValidation.createItem),
    templateController.createItem
  )
  .get(templateController.getAllItems);

export default router;
