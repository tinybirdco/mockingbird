import { Schema } from "../types";

const flappybird: Schema = {
  session_id: {
    type: "string.uuid",
  },
  score: {
    type: "number.int",
    params: [
      {
        min: 0,
        max: 100,
      },
    ],
  },
  duration: {
    type: "number.int",
    params: [
      {
        min: 5,
        max: 300,
      },
    ],
  },
};

export default flappybird;
