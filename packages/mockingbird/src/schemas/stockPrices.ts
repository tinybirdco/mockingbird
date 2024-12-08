import { Schema } from "../types";

const stockPrices: Schema = {
  amount: {
    type: "number.float",
  },
  date: {
    type: "mockingbird.datetimeNow",
  },
  stock_symbol: {
    type: "mockingbird.pick",
    params: [
      {
        values: ["ABF:XLON", "ADS:XETR", "APG:XNYS", "APPS:XMAD", "BLNK:XNAS"],
      },
    ],
  },
};

export default stockPrices;
