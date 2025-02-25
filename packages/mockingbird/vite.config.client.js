import { resolve } from "path";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  // config options
  root: "./src",
  build: {
    lib: {
      entry: resolve(__dirname, "./src/client.ts"),
      entryName: "client",
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}/index.${format}.js`,
      name: "mockingbird",
    },
    rollupOptions: {
      external: [
        // Node-only dependencies that should not be bundled
        "@aws-sdk/client-kinesis",
        "@google-cloud/spanner",
        "amqplib",
        "google-auth-library",
        // Add any other Node.js only dependencies here
      ],
    },
    outDir: "../dist",
    emptyOutDir: false,
    target: "modules",
  },
  plugins: [visualizer()],
});
