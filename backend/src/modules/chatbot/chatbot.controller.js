import httpStatus from "http-status";
import ApiResponse from "../../core/utils/ApiResponse.js";
import * as chatbotService from "./chatbot.service.js";

export const chat = async (req, res, next) => {
  try {
    res.set({
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    });
    res.write(`${JSON.stringify({ status: "loading" })}\n`);

    for await (const token of chatbotService.streamReply(req.body)) {
      res.write(`${JSON.stringify({ token })}\n`);
    }

    res.end(`${JSON.stringify({ done: true })}\n`);
  } catch (error) {
    if (res.headersSent) {
      res.end(`${JSON.stringify({ error: error.message })}\n`);
      return;
    }
    next(error);
  }
};
