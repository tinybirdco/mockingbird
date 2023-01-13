import dataTypes from "./dataTypes";
import { TinybirdSchema } from "./types";

export default function validateSchema(schema: TinybirdSchema) {
  const errors = [];

  for (const key in schema) {
    const type = schema[key].type;

    if (!(type in dataTypes)) {
      // The type provided was not recognised i.e. it's not a key in the DataTypes obj
      errors.push("Invalid type: " + type + " for item: " + key);
    } else {
      // The type was recognised, validate provided parameters (if required)
      if ("params" in dataTypes[type]) {
        const provided_params = schema[key].params;
        const validity = dataTypes[type].params?.safeParse(provided_params) ?? {
          success: true,
        };

        if (!validity.success) errors.push(validity.error.message);
      }
    }
  }

  return { valid: !errors.length, errors };
}
