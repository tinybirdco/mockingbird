#!/usr/bin/env node

import fs from "fs";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import {
  presetSchemas,
  TinybirdGenerator,
  UpstashKafkaGenerator,
} from "@tinybirdco/mockingbird";

const presetSchemaNames = Object.keys(presetSchemas);

const tinybirdConfigOptions = {
  "tb-datasource": {
    describe: "Tinybird datasource",
  },
  "tb-token": {
    describe: "Tinybird API token",
  },
  "tb-endpoint": {
    describe: "Tinybird API endpoint",
    choices: ["eu_gcp", "us_gcp", "custom"],
  },
};

const upstashKafkaConfigOptions = {
  "uk-address": {
    describe: "Upstash Kafka address",
  },
  "uk-user": {
    describe: "Upstash Kafka user",
  },
  "uk-pass": {
    describe: "Upstash Kafka password",
  },
  "uk-topic": {
    describe: "Upstash Kafka topic",
  },
};

const argv = yargs(hideBin(process.argv)).options({
  template: {
    describe: "Template to use for populating",
    default: presetSchemaNames[0],
    choices: presetSchemaNames,
    conflicts: ["schema"],
  },
  schema: {
    describe: "Path to schema file",
    conflicts: ["template"],
  },
  eps: {
    describe: "Events per second",
    default: 1,
  },
  limit: {
    describe: "Max number of rows to send (-1 for unlimited)",
    default: -1,
  },
  logs: {
    describe: "Enable logs",
    default: true,
  },
  generator: {
    describe: "Generator to use",
    demandOption: true,
    choices: ["tinybird", "upstash-kafka"],
  },
  ...tinybirdConfigOptions,
  ...upstashKafkaConfigOptions,
}).argv;

async function main() {
  const schema = argv.schema
    ? JSON.parse(fs.readFileSync(argv.schema, "utf8"))
    : presetSchemas[argv.template];

  let generator;
  if (argv.generator === "tinybird") {
    generator = new TinybirdGenerator({
      schema,
      eps: argv.eps,
      limit: argv.limit,
      logs: argv.logs,
      endpoint: ["eu_gcp", "us_gcp"].includes(argv.endpoint)
        ? argv.endpoint
        : process.env.TB_ENDPOINT,
      datasource: argv.datasource,
      token: argv.token,
    });
  } else if (argv.generator === "upstash-kafka") {
    generator = new UpstashKafkaGenerator({
      schema,
      eps: argv.eps,
      limit: argv.limit,
      logs: argv.logs,
      address: argv.address,
      user: argv.user,
      pass: argv.pass,
      topic: argv.topic,
    });
  }

  await generator.generate();
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
