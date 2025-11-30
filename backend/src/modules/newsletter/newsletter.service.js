import newsletterModel from "./newsletter.model.js";
import ApiError from "../../core/utils/ApiError.js";

const subscribe = async (email) => {
  const existing = await newsletterModel.subscribe(email);
  // If 'subscribe' returned nothing, it means the email already existed.
  if (!existing) {
    // You could return a specific message or treat it as a success.
    // For a basic implementation, we can just signal it's already done.
    return { message: "This email is already subscribed." };
  }
  return { message: "Successfully subscribed!" };
};

export default {
  subscribe,
};
