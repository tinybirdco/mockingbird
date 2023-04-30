import fs from "fs";
import _get from "lodash.get";
import path from "path";
import { defineConfig } from "tsup";

import extendedFaker from "./src/extendedFaker";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: true,
  dts: true,
  minify: isProduction,
  clean: true,
  onSuccess: async () => {
    const {
      helpers,
      locales,
      fake,
      unique,
      mersenne,
      definitions,
      ...strippedFaker
    } = extendedFaker;

    function getPathsToLeaves(
      obj: Record<string, any>,
      prefix = "",
      maxDepth = Infinity
    ): string[] {
      if (typeof obj !== "object" || maxDepth === 0) {
        return [prefix];
      }

      let paths: string[] = [];
      for (let key in obj) {
        const newPath = prefix ? `${prefix}.${key}` : key;
        paths = paths.concat(getPathsToLeaves(obj[key], newPath, maxDepth - 1));
      }

      return paths;
    }

    const typeEnum = getPathsToLeaves(strippedFaker, "", 2).filter(
      (path) => !["_locale", "_localeFallback"].includes(path)
    );

    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      additionalProperties: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: typeEnum,
          },
          count: {
            type: "integer",
          },
          params: {
            type: "array",
          },
        },
        required: ["type"],
      },
    };

    fs.writeFileSync(
      path.join(__dirname, "dist", "schema.json"),
      JSON.stringify(schema, null, 2)
    );
  },
});
