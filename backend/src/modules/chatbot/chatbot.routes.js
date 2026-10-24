import { Router } from "express";
import validate from "../../core/middlewares/validation.middleware.js";
import * as chatbotController from "./chatbot.controller.js";
import * as chatbotValidation from "./chatbot.validation.js";

const router = Router();

router.post("/", validate(chatbotValidation.chat), chatbotController.chat);

export default router;