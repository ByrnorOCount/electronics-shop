// frontend/src/features/newsletter/newsletterService.js
import api from "../../api/axios";

const subscribe = (email) => {
  return api.post("/newsletter/subscribe", { email });
};

export default {
  subscribe,
};
