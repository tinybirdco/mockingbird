import { defineConfig } from "tsup";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: true,
  dts: true,
  minify: isProduction,
  clean: true,
});
