import { Schema } from "../types";

const simpleExample: Schema = {
  some_int: {
    type: "number.int",
  },
  some_values: {
    type: "mockingbird.pick",
    params: [
      {
        values: [123, 456],
      },
    ],
  },
};

export default simpleExample;
