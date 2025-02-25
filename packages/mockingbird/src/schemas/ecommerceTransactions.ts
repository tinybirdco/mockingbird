import { Schema } from "../types";

const ecommerceTransactions: Schema = {
  timestamp: {
    type: "mockingbird.timestampNow",
  },
  store_id: {
    type: "number.int",
    params: { min: 1, max: 6 },
  },
  browser: {
    type: "helpers.weightedArrayElement",
    params: [
      { weight: 65, value: "Chrome" },
      { weight: 3, value: "Brave" },
      { weight: 8, value: "Firefox" },
      { weight: 20, value: "Safari" },
    ],
  },
  product_id: {
    type: "number.int",
    params: { min: 3278123, max: 3378123 },
  },
  promo: {
    type: "helpers.weightedArrayElement",
    params: [
      { weight: 19, value: 0 },
      { weight: 1, value: 1 },
    ],
  },
  sales: {
    type: "helpers.weightedArrayElement",
    params: [
      { weight: 50, value: 1 },
      { weight: 5, value: 2 },
      { weight: 2, value: 3 },
      { weight: 1, value: 4 },
    ],
  },
  utm_source: {
    type: "helpers.weightedArrayElement",
    params: [
      { weight: 65, value: "instagram" },
      { weight: 13, value: "newsletter" },
      { weight: 18, value: "tiktok" },
      { weight: 20, value: "search_engine" },
    ],
  },
};

export default ecommerceTransactions;
