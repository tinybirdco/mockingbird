import { Schema } from "../types";

const contentTracking: Schema = {
  timestamp: {
    type: "mockingbird.timestampNow",
  },
  userId: {
    type: "string.uuid",
  },
  contentId: {
    type: "string.uuid",
  },
  timeSpentSeconds: {
    type: "number.int",
    params: [
      {
        min: 1,
        max: 3600,
      },
    ],
  },
  scrollDepthPercent: {
    type: "number.int",
    params: [
      {
        min: 0,
        max: 100,
      },
    ],
  },
};

export default contentTracking;
