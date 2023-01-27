#!/usr/bin/env node

import fs from "fs";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import {
  presetSchemas,
  initializeGenerator,
  ALL_TINYBIRD_ENDPOINTS,
  generate,
} from "tinybird-generator";

const presetSchemaNames = Object.keys(presetSchemas);

const argv = yargs(hideBin(process.argv))
  .example("node index.js --datasource=XXX --token=XXX --endpoint=XXX")
  .options({
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
    datasource: {
      describe: "Tinybird datasource",
      demandOption: true,
    },
    token: {
      describe: "Tinybird API token",
      demandOption: true,
    },
    endpoint: {
      describe: "Tinybird API endpoint",
      demandOption: true,
      choices: ["eu_gcp", "us_gcp", "custom"],
    },
    eps: {
      describe: "Events per second",
      default: 1,
    },
    limit: {
      describe: "Max number of rows to send (-1 for unlimited)",
      default: -1,
    },
  }).argv;

const schema = argv.schema
  ? JSON.parse(fs.readFileSync(argv.schema, "utf8"))
  : presetSchemas[argv.template];

initializeGenerator({
  schema,
  endpoint: ALL_TINYBIRD_ENDPOINTS.includes(argv.endpoint)
    ? argv.endpoint
    : process.env.TB_ENDPOINT,
  datasource: argv.datasource,
  token: argv.token,
  eps: argv.eps,
  limit: argv.limit,
});

await generate();
