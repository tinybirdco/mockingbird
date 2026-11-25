import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { extendedFaker, LogGenerator } from "../dist/index.js";

test("timestampNowUnix returns milliseconds since the Unix epoch", () => {
  const before = Date.now();
  const value = extendedFaker.mockingbird.timestampNowUnix();
  assert.equal(typeof value, "number");
  assert.ok(Number.isInteger(value));
  assert.ok(value >= before && value <= Date.now());
});

test("timestampNow keeps returning an ISO string", () => {
  const value = extendedFaker.mockingbird.timestampNow();
  assert.equal(typeof value, "string");
  assert.equal(new Date(value).toISOString(), value);
});

test("schemas generate numeric timestamps, including repeated values", async () => {
  const before = Date.now();
  const generator = new LogGenerator({
    schema: {
      timestamp: { type: "mockingbird.timestampNowUnix" },
      timestamps: { type: "mockingbird.timestampNowUnix", count: 2 },
      iso: { type: "mockingbird.timestampNow" },
    },
  });
  const row = generator.generateRow();
  for (const value of [row.timestamp, ...row.timestamps]) {
    assert.equal(typeof value, "number");
    assert.ok(value >= before && value <= Date.now());
  }
  assert.equal(row.timestamps.length, 2);
  assert.equal(typeof row.iso, "string");
  const schema = await readFile(
    new URL("../dist/Schema.json", import.meta.url),
    "utf8",
  );
  assert.ok(schema.includes('"mockingbird.timestampNowUnix"'));
});
