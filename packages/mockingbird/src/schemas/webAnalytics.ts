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
    type: "mockingbird.pick",
    params: [
      {
        values: [
          "https://example.com/home",
          "https://example.com/products",
          "https://example.com/about",
          "https://example.com/contact",
        ],
      },
    ],
  },
  referrer: {
    type: "mockingbird.pick",
    params: [
      {
        values: [
          "https://google.com",
          "https://facebook.com",
          "https://twitter.com",
          "direct",
        ],
      },
    ],
  },
};

export default webAnalytics;
