import { presetSchemas } from "@tinybirdco/mockingbird/server";
import fs from "fs";

export const presetSchemaNames = Object.keys(presetSchemas);

const commonOptions = {
  template: {
    describe: "Template to use for populating",
    default: presetSchemaNames[0],
    choices: presetSchemaNames,
  },
  schema: {
    describe: "Path to schema file",
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
};

export const createCommand = ({
  name,
  options,
  generator,
  middlewares = [],
}) => [
  name,
  true,
  (yargs) => yargs.options({ ...commonOptions, ...options }),
  (config) =>
    new generator(config).generate(name === "base" ? console.log : undefined),
  [parseSchemaMiddleware, ...middlewares],
];

const parseSchemaMiddleware = (argv) => ({
  schema: argv.schema
    ? JSON.parse(fs.readFileSync(argv.schema, "utf8"))
    : presetSchemas[argv.template],
});
