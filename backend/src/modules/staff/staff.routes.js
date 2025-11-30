import express from "express";
import * as staffController from "./staff.controller.js";
import * as staffValidation from "./staff.validation.js";
import {
  authenticate,
  isStaff,
  isAuthenticated,
} from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validation.middleware.js";
import multer from "multer";
import httpStatus from "http-status";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ApiError from "../../core/utils/ApiError.js";

// Determine the correct path to the frontend's public/images directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Path from backend/src/modules/staff -> frontend/public/images
const uploadDir = path.join(__dirname, "../../../../frontend/public/images");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filePath = path.join(uploadDir, file.originalname);
    // Check if file already exists and reject if it does
    if (fs.existsSync(filePath)) {
      return cb(
        new ApiError(
          httpStatus.CONFLICT,
          "A file with this name already exists. Please rename the file and try again."
        )
      );
    }
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new ApiError(httpStatus.BAD_REQUEST, "Only image files are allowed."),
        false
      );
    }
  },
});

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

// New route for image uploads
router.post(
  "/products/upload-image",
  upload.single("image"),
  staffController.uploadProductImage
);

router
  .route("/orders")
  .get(validate(staffValidation.getAllOrders), staffController.getAllOrders);

router
  .route("/orders/:id/status")
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
