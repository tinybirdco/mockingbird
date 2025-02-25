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
    params: { min: 18, max: 99 },
  },
  passport_number: {
    type: "number.int",
    params: { min: 3456789, max: 9876543 },
  },
  flight_from: {
    type: "location.city",
  },
  flight_to: {
    type: "location.city",
  },
  extra_bags: {
    type: "helpers.weightedArrayElement",
    params: [
      { weight: 45, value: 0 },
      { weight: 35, value: 1 },
      { weight: 10, value: 2 },
      { weight: 4, value: 3 },
      { weight: 2, value: 4 },
      { weight: 1, value: 5 },
      { weight: 1, value: 6 },
      { weight: 1, value: 7 },
      { weight: 1, value: 8 },
      { weight: 1, value: 9 },
    ],
  },
  priority_boarding: {
    type: "datatype.boolean",
  },
  meal_choice: {
    type: "helpers.weightedArrayElement",
    params: [
      { weight: 60, value: "none" },
      { weight: 5, value: "vegan" },
      { weight: 10, value: "vegetarian" },
      { weight: 10, value: "halal" },
      { weight: 10, value: "kosher" },
      { weight: 5, value: "gluten" },
    ],
  },
  airline: {
    type: "helpers.weightedArrayElement",
    params: [
      { weight: 20, value: "BrianAir" },
      { weight: 5, value: "Fizz" },
      { weight: 15, value: "EasyPlane" },
      { weight: 20, value: "Skittish Airways" },
      { weight: 15, value: "GAS" },
      { weight: 10, value: "Ler Dingus" },
      { weight: 15, value: "Red Balloon" },
    ],
  },
};

export default flightBookings;
