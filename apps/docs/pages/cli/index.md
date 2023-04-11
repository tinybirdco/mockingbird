# Mockingbird CLI

The Mockingbird CLI is a node-based CLI tool to invoke Mockingbird.

## Installation

The CLI is available from [npm](https://www.npmjs.com/package/@tinybirdco/mockingbird-cli).

You can install it using `npm install -G @tinybirdco/mockingbird-cli`

## Basic Usage

Call the Mockingbird CLI with `mockingbird-cli`.

Use `mockingbird-cli --help` to get a list of available commands.

```
Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --template    Template to use for populating
        [choices: "Default", "ACME Store", "z_sales", "Stock Prices", "Flights",
   "Content Tracking", "Web Analytics Starter Kit", "Log Analytics Starter Kit"]
                                                            [default: "Default"]
  --schema      Path to schema file
  --datasource  Tinybird datasource                                   [required]
  --token       Tinybird API token                                    [required]
  --endpoint    Tinybird API endpoint
                              [required] [choices: "eu_gcp", "us_gcp", "custom"]
  --eps         Events per second                                   [default: 1]
  --limit       Max number of rows to send (-1 for unlimited)      [default: -1]

Examples:
  mockingbird-cli --datasource=XYZ --token=XYZ --endpoint=XYZ
```

As an example, to send data to Tinybird, in the EU region, using the `Stock Prices` template, to a Data Source called `stocks`, at 100 Events Per Second:

```
mockingbird-cli --datasource=stocks --token=e.pXXX --endpoint=eu_gcp --template "Stock Prices" --eps 100
```