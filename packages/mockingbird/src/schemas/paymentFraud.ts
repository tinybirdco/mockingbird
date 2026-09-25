import { Schema } from "../types";

const paymentFraud: Schema = {
  timestamp: {
    type: "mockingbird.timestampNow",
  },
  transaction_id: {
    type: "string.uuid",
  },
  user_id: {
    type: "mockingbird.pick",
    params: [
      {
        values: [
          "Mike",
          "John",
          "Jane",
          "Mary",
          "Bob",
          "Alice",
          "Joe",
          "Sue",
          "Ryan",
          "Jill",
          "Bill",
          "Jen",
          "Jack",
          "Tom",
          "Tim",
          "Tina",
          "Terry",
          "Troy",
          "Tara",
          "Tanya",
          "Trevor",
          "Tucker",
          "Trent",
          "Trenton",
          "Mario",
        ],
      },
    ],
  },
  amount: {
    type: "number.float",
    params: [
      {
        min: 1,
        max: 5000,
      },
    ],
  },
  ip_address: {
    type: "internet.ip",
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
  location: {
    type: "mockingbird.pickWeighted",
    params: [
      {
        values: ["USA", "Spain", "UK", "Australia", "Mexico", "China", "Japan", "Canada"],
        weights: [65, 20, 8, 1, 3, 1, 1, 1],
      },
    ],
  },
  is_declined: {
    type: "mockingbird.pickWeighted",
    params: [
      {
        values: [true, false],
        weights: [3, 98],
      },
    ],
  },
  fraud_flag: {
    type: "datatype.boolean",
  },
};

export default paymentFraud;
