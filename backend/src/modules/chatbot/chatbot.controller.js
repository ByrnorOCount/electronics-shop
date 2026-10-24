import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";
import * as chatbotService from "./chatbot.service.js";

export const chat = async (req, res, next) => {
  try {
    const answer = await chatbotService.reply(req.body);
    res
      .status(httpStatus.OK)
      .json(
        new ApiResponse(httpStatus.OK, { answer }, "Chat response generated.")
      );
  } catch (error) {
    next(error);
  }
};