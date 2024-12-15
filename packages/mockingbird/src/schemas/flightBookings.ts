import { Schema } from "../types";

const flightBookings: Schema = {
  timestamp: {
    type: "mockingbird.timestampNow",
  },
  transaction_id: {
    type: "string.uuid",
  },
  name: {
    type: "person.fullName",
  },
  email: {
    type: "internet.email",
  },
  age: {
    type: "number.int",
    params: [
      {
        min: 18,
        max: 99,
      },
    ],
  },
  passport_number: {
    type: "number.int",
    params: [
      {
        min: 3456789,
        max: 9876543,
      },
    ],
  },
  flight_from: {
    type: "location.city",
  },
  flight_to: {
    type: "location.city",
  },
  extra_bags: {
    type: "mockingbird.pickWeighted",
    params: [
      {
        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        weights: [45, 35, 10, 4, 2, 1, 1, 1, 1, 1],
      },
    ],
  },
  priority_boarding: {
    type: "datatype.boolean",
  },
  meal_choice: {
    type: "mockingbird.pickWeighted",
    params: [
      {
        values: ["none", "vegan", "vegetarian", "halal", "kosher", "gluten"],
        weights: [60, 5, 10, 10, 10, 5],
      },
    ],
  },
  airline: {
    type: "mockingbird.pickWeighted",
    params: [
      {
        values: [
          "BrianAir",
          "Fizz",
          "EasyPlane",
          "Skittish Airways",
          "GAS",
          "Ler Dingus",
          "Red Balloon",
        ],
        weights: [20, 5, 15, 20, 15, 10, 15],
      },
    ],
  },
};

export default flightBookings;
