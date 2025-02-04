import { resolve } from "path";
import { defineConfig } from "vite";
import { builtinModules } from "node:module";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  // config options
  root: "./src",
  build: {
    lib: {
      entry: resolve(__dirname, "./src/server.ts"),
      entryName: "server",
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}/index.${format}.js`,
      name: "mockingbird",
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`),
        // Add any npm dependencies that should not be bundled
        "@aws-sdk/client-kinesis",
        "@google-cloud/spanner",
        "amqplib",
        "google-auth-library",
      ],
    },
    outDir: "../dist",
    emptyOutDir: false,
    target: "esnext",
  },
  define: {
    // Polyfill globals for Node.js environment
    'global': 'globalThis',
    'self': 'globalThis',
    'window': 'globalThis',
  },
});
