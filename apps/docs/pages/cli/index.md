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
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  --template       Template to use for populating
   [choices: "Simple Example", "eCommerce Transactions", "Stock Prices", "Flight
      Bookings", "Content Tracking", "Web Analytics Starter Kit", "Log Analytics
                                       Starter Kit"] [default: "Simple Example"]
  --schema         Path to schema file
  --eps            Events per second                                [default: 1]
  --limit          Max number of rows to send (-1 for unlimited)   [default: -1]
  --logs           Enable logs                                   [default: true]
  --generator      Generator to use
                               [required] [choices: "tinybird", "upstash-kafka"]
  --tb-datasource  Tinybird datasource
  --tb-token       Tinybird API token
  --tb-endpoint    Tinybird API endpoint [choices: "eu_gcp", "us_gcp", "custom"]
  --uk-address     Upstash Kafka address
  --uk-user        Upstash Kafka user
  --uk-pass        Upstash Kafka password
  --uk-topic       Upstash Kafka topic
```

As an example, to send data to Tinybird, in the EU region, using the `Stock Prices` template, to a Data Source called `stocks`, at 100 Events Per Second:

```
mockingbird-cli --generator tinybird --tb-datasource=stocks --tb-token=e.pXXX --tb-endpoint=eu_gcp --template "Stock Prices" --eps 100
```