import newsletterService from "./newsletter.service.js";
import ApiResponse from "../../core/utils/ApiResponse.js";

const subscribe = async (req, res, next) => {
  try {
    const result = await newsletterService.subscribe(req.body.email);
    res.status(200).json(new ApiResponse(200, result));
  } catch (error) {
    next(error);
  }
};

export default {
  subscribe,
};
