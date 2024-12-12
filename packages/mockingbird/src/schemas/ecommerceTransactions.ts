import { Schema } from "../types";

const ecommerceTransactions: Schema = {
  timestamp: {
    type: "mockingbird.timestampNow",
  },
  store_id: {
    type: "number.int",
    params: [
      {
        min: 1,
        max: 6,
      },
    ],
  },
  browser: {
    type: "mockingbird.pickWeighted",
    params: [
      {
        values: ["Chrome", "Brave", "Firefox", "Safari"],
        weights: [65, 3, 8, 20],
      },
    ],
  },
  product_id: {
    type: "number.int",
    params: [
      {
        min: 3278123,
        max: 3378123,
      },
    ],
  },
  promo: {
    type: "mockingbird.pickWeighted",
    params: [
      {
        values: [0, 1],
        weights: [19, 1],
      },
    ],
  },
  sales: {
    type: "mockingbird.pickWeighted",
    params: [
      {
        values: [1, 2, 3, 4],
        weights: [50, 5, 2, 1],
      },
    ],
  },
  utm_source: {
    type: "mockingbird.pickWeighted",
    params: [
      {
        values: ["instagram", "newsletter", "tiktok", "search_engine"],
        weights: [65, 13, 18, 20],
      },
    ],
  },
};

export default ecommerceTransactions;
