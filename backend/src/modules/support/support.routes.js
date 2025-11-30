import express from "express";
import * as supportController from "./support.controller.js";
import * as supportValidation from "./support.validation.js";
import validate from "../../core/middlewares/validation.middleware.js";
import {
  authenticate,
  isAuthenticated,
} from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

// Route for FAQs (public)
router.route("/faq").get(supportController.getFaqs);

router
  .route("/")
  // A user submits a ticket
  .post(
    express.json(),
    authenticate,
    isAuthenticated,
    validate(supportValidation.submitTicket),
    supportController.submitTicket
  )
  // A user gets their own tickets
  .get(authenticate, isAuthenticated, supportController.getUserTickets);

router
  .route("/:ticketId")
  .get(
    authenticate,
    isAuthenticated,
    validate(supportValidation.getTicketById),
    supportController.getTicketById
  );

router
  .route("/:ticketId/reply")
  .post(
    express.json(),
    authenticate,
    isAuthenticated,
    validate(supportValidation.addTicketReply),
    supportController.addTicketReply
  );

router
  .route("/:ticketId/status")
  .put(
    express.json(),
    authenticate,
    isAuthenticated,
    validate(supportValidation.updateTicketStatus),
    supportController.updateTicketStatus
  );

export default router;
