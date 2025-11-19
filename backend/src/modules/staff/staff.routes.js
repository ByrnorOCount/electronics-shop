import express from "express";
import * as staffController from "./staff.controller.js";
import * as staffValidation from "./staff.validation.js";
import {
  authenticate,
  isStaff,
  isAuthenticated,
} from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";

const router = express.Router();

router.use(authenticate, isAuthenticated, isStaff);

router
  .route("/products")
  .post(validate(staffValidation.createProduct), staffController.createProduct)
  .get(
    validate(staffValidation.getAllProducts),
    staffController.getAllProducts
  );

router
  .route("/products/:id")
  .put(validate(staffValidation.updateProduct), staffController.updateProduct)
  .delete(
    validate(staffValidation.deleteProduct),
    staffController.deleteProduct
  );

router
  .route("/orders")
  .get(validate(staffValidation.getAllOrders), staffController.getAllOrders);

router
  .route("/orders/:id")
  .put(
    validate(staffValidation.updateOrderStatus),
    staffController.updateOrderStatus
  );

router
  .route("/support-tickets")
  .get(
    validate(staffValidation.getAllSupportTickets),
    staffController.getAllSupportTickets
  );

router
  .route("/support-tickets/:ticketId/reply")
  .post(validate(staffValidation.replyToTicket), staffController.replyToTicket);

router
  .route("/support-tickets/:ticketId/status")
  .put(
    validate(staffValidation.updateTicketStatus),
    staffController.updateTicketStatus
  );

export default router;
