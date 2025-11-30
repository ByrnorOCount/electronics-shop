import express from "express";
import newsletterController from "./newsletter.controller.js";
import validate from "../../core/middlewares/validation.middleware.js";
import newsletterValidation from "./newsletter.validation.js";

const router = express.Router();

router.post(
  "/subscribe",
  validate(newsletterValidation.subscribe),
  newsletterController.subscribe
);

export default router;
