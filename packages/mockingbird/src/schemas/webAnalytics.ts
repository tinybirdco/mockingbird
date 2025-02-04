import { Schema } from "../types";

const webAnalytics: Schema = {
  timestamp: {
    type: "mockingbird.timestampNow",
  },
  session_id: {
    type: "string.uuid",
  },
  user_id: {
    type: "string.uuid",
  },
  page_url: {
    type: "helpers.arrayElement",
    params: [
      "https://example.com/home",
      "https://example.com/products",
      "https://example.com/about",
      "https://example.com/contact",
    ],
  },
  referrer: {
    type: "helpers.arrayElement",
    params: [
      "https://google.com",
      "https://facebook.com",
      "https://twitter.com",
      "direct",
    ],
  },
};

export default webAnalytics;
