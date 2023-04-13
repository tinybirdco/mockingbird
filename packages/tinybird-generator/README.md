# Tinybird data generator

## Features

- Type definitions
- 8 preset schemas
- Custom schemas

## Installing

```bash
$ npm install @tinybirdco/mockingbird
```

## Usage

### Tinybird Generator

```js
import { TinybirdGenerator } from "@tinybirdco/mockingbird";

const tbGenerator = new TinybirdGenerator({
  schema: z.object({}), // Javascript object containing valid generator schema
  eps: z.number().optional().default(1), // Events per second
  limit: z.number().optional().default(-1), // Event limit
  endpoint: z.string(), // Tinybird endpoint (eu_gcp, us_gcp or custom one)
  datasource: z.string(), // Name of the Tinybird datasource
  token: z.string(), // Tinybird admin token
});

await tbGenerator.generate();
```

### Upstash Kafka Generator

```js
const ukGenerator = new UpstashKafkaGenerator({
  schema: z.object({}), // Javascript object containing valid generator schema
  eps: z.number().optional().default(1), // Events per second
  limit: z.number().optional().default(-1), // Event limit
  address: z.string().url(), // Upstash URL
  user: z.string(), // Upstash user
  pass: z.string(), // Upstash password
  topic: z.string(), // Kafka topic to send data to
});

await tbGenerator.generate();

```

### Preset schemas

```js
import { presetSchemas } from "@tinybirdco/mockingbird";

const schema = presetSchemas["Web Analytics Starter Kit"];

const tbGenerator = new TinybirdGenerator({
  schema,
  ...
})

```
