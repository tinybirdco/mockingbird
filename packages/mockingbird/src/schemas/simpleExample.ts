import { Schema } from "../types";

const simpleExample: Schema = {
  some_int: {
    type: "number.int",
  },
  some_values: {
    type: "helpers.arrayElement",
    params: [123, 456],
  },
};

export default simpleExample;
