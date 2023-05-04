#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { subcommands } from "./subcommands.js";
import { createCommand } from "./utils.js";

subcommands
  .reduce(
    (yargs, subcommand) => yargs.command(...createCommand(subcommand)),
    yargs(hideBin(process.argv))
  )
  .demandCommand(1)
  .help().argv;
