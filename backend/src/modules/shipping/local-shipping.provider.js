const deliveryZones = {
  local: {
    name: "Same city",
    baseFeeVND: 20_000,
    deliveryDays: "1–2 business days",
  },
  nearby: {
    name: "Nearby province",
    baseFeeVND: 28_000,
    deliveryDays: "2–3 business days",
  },
  regional: {
    name: "Other province",
    baseFeeVND: 35_000,
    deliveryDays: "3–5 business days",
  },
  remote: {
    name: "Remote area",
    baseFeeVND: 45_000,
    deliveryDays: "5–7 business days",
  },
};

const INCLUDED_WEIGHT_GRAMS = 1_000;
const SURCHARGE_PER_500_GRAMS_VND = 6_000;

export const getDeliveryZones = () =>
  Object.entries(deliveryZones).map(([id, zone]) => ({
    id,
    name: zone.name,
    estimatedDelivery: zone.deliveryDays,
  }));

export const calculateLocalShippingQuote = ({ zone, chargeableWeightGrams }) => {
  const deliveryZone = deliveryZones[zone];
  if (!deliveryZone) {
    throw new Error(`Unknown local shipping zone: ${zone}`);
  }

  const additionalWeightUnits = Math.ceil(
    Math.max(0, chargeableWeightGrams - INCLUDED_WEIGHT_GRAMS) / 500
  );

  return {
    zone,
    zoneName: deliveryZone.name,
    shippingFeeVND:
      deliveryZone.baseFeeVND +
      additionalWeightUnits * SURCHARGE_PER_500_GRAMS_VND,
    estimatedDelivery: deliveryZone.deliveryDays,
    chargeableWeightGrams,
  };
};
