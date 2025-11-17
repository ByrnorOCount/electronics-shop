import express from "express";
import * as supportController from "./support.controller.js";
import * as supportValidation from "./support.validation.js";
import validate from "../../core/middlewares/validation.middleware.js";
import { authenticate } from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

// Route for FAQs (public)
router.route("/faq").get(supportController.getFaqs);

router
  .route("/")
  // A user submits a ticket
  .post(
    authenticate,
    validate(supportValidation.submitTicket),
    supportController.submitTicket
  )
  // A user gets their own tickets
  .get(authenticate, supportController.getUserTickets);

router
  .route("/:ticketId")
  .get(
    authenticate,
    validate(supportValidation.getTicketById),
    supportController.getTicketById
  );

export default router;
