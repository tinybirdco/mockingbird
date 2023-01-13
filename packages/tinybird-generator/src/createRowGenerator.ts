import dataTypes from "./dataTypes";
import { TinybirdRowGenerator, TinybirdSchema } from "./types";

export default function createRowGenerator(
  schema: TinybirdSchema
): TinybirdRowGenerator {
  const generatorSchema = Object.entries(schema).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: {
        generator: dataTypes[value.type].generator,
        params: value.params ?? {},
      },
    }),
    {}
  );

  return {
    generate() {
      return Object.entries(generatorSchema).reduce((acc, [key, value]) => {
        const v = value as { generator: Function; params: unknown[] };

        return {
          ...acc,
          [key]: v.generator(v.params),
        };
      }, {});
    },
  };
}
