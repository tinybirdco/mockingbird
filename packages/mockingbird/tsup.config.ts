import fs from "fs";
import path from "path";
import { defineConfig } from "tsup";
import * as TJS from "typescript-json-schema";

import { typeFootprint } from "./typeFootprint";

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
    const schemaFootprint = typeFootprint("./src/types.ts", "Schema");

    fs.writeFileSync(
      path.join(__dirname, "dist", "Schema.ts"),
      schemaFootprint
    );

    const program = TJS.getProgramFromFiles([
      path.join(__dirname, "dist", "Schema.ts"),
    ]);

    const schema = TJS.generateSchema(program, "Schema");

    fs.writeFileSync(
      path.join(__dirname, "dist", "Schema.json"),
      JSON.stringify(schema, null, 2)
    );
  },
});
