import { Schema } from "../types";

const logAnalytics: Schema = {
  acceptcharset: {
    type: "mockingbird.pick",
    params: [
      {
        values: ["UTF-8", "ISO-8859-1", "Windows-1252"],
      },
    ],
  },
  ip_address: {
    type: "mockingbird.pick",
    params: [
      {
        values: ["192.168.1.1", "10.0.0.1", "172.16.0.1", "127.0.0.1"],
      },
    ],
  },
  xforwaredforip: {
    type: "mockingbird.pick",
    params: [
      {
        values: ["203.0.113.1", "198.51.100.1", "192.0.2.1"],
      },
    ],
  },
};

export default logAnalytics;
