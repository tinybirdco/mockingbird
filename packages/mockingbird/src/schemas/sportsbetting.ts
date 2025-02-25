import { Schema } from "../types";

const sportsbetting: Schema = {
  timestamp: {
    type: "mockingbird.timestampNow",
  },
  location: {
    type: "location.nearbyGPSCoordinate",
    params: {
      isMetric: true,
      radius: 5,
      origin: [35.225808, -80.852861],
    },
  },
  userEmail: {
    type: "internet.email",
  },
};

export default sportsbetting;
