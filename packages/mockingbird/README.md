# Mockingbird

## Features

- All faker functions and custom functions
- Type definitions
- 5 destinations - Ably, AWS SNS, Confluent Cloud Kafka, Tinybird and Upstash Kafka
- 8 preset schemas

## Installing

```bash
$ npm install @tinybirdco/mockingbird
```

## Usage

```js
import { TinybirdGenerator } from "@tinybirdco/mockingbird";

const tbGenerator = new TinybirdGenerator({
  schema: z.object({}), // Javascript object containing valid generator schema
  eps: z.number().optional().default(1), // Events per second
  limit: z.number().optional().default(-1), // Event limit
  logs: z.boolean().optional().default(false), // Enables logs
  endpoint: z.string(), // Tinybird endpoint (e.g. gcp_europe_west3, gcp_us_east4, aws_eu_central_1, aws_us_east_1, aws_us_west_2 or custom one)
  datasource: z.string(), // Name of the Tinybird datasource
  token: z.string(), // Tinybird admin token
});

await tbGenerator.generate();
```

## Preset schemas

```js
import { presetSchemas } from "@tinybirdco/mockingbird";

const schema = presetSchemas["Web Analytics Starter Kit"];

const tbGenerator = new TinybirdGenerator({
  schema,
  ...
})

```
