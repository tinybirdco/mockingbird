import fs from "fs";
import path from "path";
import * as TJS from "ts-json-schema-generator";
import { type Config as TSJConfig } from "ts-json-schema-generator/dist/src/Config";
import { defineConfig } from "tsup";

import { typeFootprint } from "./typeFootprint";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  splitting: false,
  sourcemap: true,
  dts: true,
  minify: isProduction,
  clean: true,
  onSuccess: async () => {
    const type = "Schema";

    const schemaFootprint = typeFootprint("./src/types.ts", type);

    fs.writeFileSync(
      path.join(__dirname, "dist", `${type}.ts`),
      schemaFootprint
    );

    const config: TSJConfig = {
      type,
      path: path.join(__dirname, "dist", `${type}.ts`),
      tsconfig: path.join(__dirname, "tsconfig.json"),
      expose: "all",
      topRef: false,
    };

    const schema = TJS.createGenerator(config).createSchema(type) as any;

    // Replace anyOf with enum
    const { anyOf } = schema.additionalProperties;
    const unparametrizedTypes = schema.additionalProperties.anyOf.find(
      (t: any) => Array.isArray(t.properties.type.anyOf)
    );
    if (unparametrizedTypes) {
      unparametrizedTypes.properties.type.enum =
        unparametrizedTypes.properties.type.anyOf.map((t: any) => t.const);
      delete unparametrizedTypes.properties.type.anyOf;
    }

    const parametrizedTypes = anyOf.slice(1).map((p: any) => ({
      ...p,
      properties: {
        ...p.properties,
        type: {
          type: "string",
          enum: [p.properties.type.const],
        },
        // Removes state from params
        params: p.properties.params
          ? {
              ...p.properties.params,
              items:
                Array.isArray(p.properties.params.items) &&
                p.properties.params.items
                  ?.at(-1)
                  ?.anyOf?.at(-1)
                  ?.required?.at(0) === "state"
                  ? p.properties.params.items.slice(0, -1)
                  : p.properties.params.items,
              minItems:
                Array.isArray(p.properties.params.items) &&
                p.properties.params.items
                  ? p.properties.params.minItems - 1
                  : undefined,
              maxItems:
                Array.isArray(p.properties.params.items) &&
                p.properties.params.items
                  ? p.properties.params.maxItems - 1
                  : undefined,
            }
          : undefined,
      },
    }));

    schema.additionalProperties.anyOf = [
      unparametrizedTypes,
      ...parametrizedTypes,
    ];

    fs.writeFileSync(
      path.join(__dirname, "dist", "Schema.json"),
      JSON.stringify(schema, null, 2)
    );
  },
});
