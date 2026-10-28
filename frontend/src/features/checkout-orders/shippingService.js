import api from "../../api/axios";

const getShippingQuote = async (zone) => {
  const response = await api.post("/shipping/calculate-fee", { zone });
  return response.data.data;
};

const shippingService = { getShippingQuote };

export default shippingService;
