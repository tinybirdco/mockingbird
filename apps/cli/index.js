#!/usr/bin/env node

import fs from "fs";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import {
  presetSchemas,
  validateSchema,
  setConfig,
  createRowGenerator,
  sendData,
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

if (!validateSchema(schema).valid) throw new Error("Invalid schema");

const min_delay_per_batch = 200;
const max_batches_per_second = 1000 / min_delay_per_batch;

let batch_size, delay_per_batch;
if (argv.eps < 1000) {
  batch_size = argv.eps;
  delay_per_batch = 1000;
} else {
  batch_size = argv.eps / max_batches_per_second;
  delay_per_batch = min_delay_per_batch;
}

setConfig({
  endpoint: argv.endpoint,
  datasource: argv.datasource,
  token: argv.token,
});

const rowGenerator = createRowGenerator(schema),
  rows = [];

let limit = argv.limit,
  sent_rows = 0;

while (true) {
  rows.push(rowGenerator.generate());
  if (rows.length >= batch_size) {
    const data = rows.splice(0, batch_size);

    try {
      await sendData(data);
    } catch (ex) {
      console.log(`ERR > ${ex}.`);
      break;
    }

    sent_rows += data.length;
    console.log(`INFO> ${sent_rows} rows sent so far...`);

    if (limit != -1 && sent_rows >= limit) break;

    await new Promise((r) => setTimeout(r, delay_per_batch));
  }
}
