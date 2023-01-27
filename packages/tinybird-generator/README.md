# Tinybird data generator

## Features

- Type defenitions
- 8 preset schemas
- Custom random schemas

## Installing

```bash
$ npm install @tinybirdco/data-generator
```

## Usage

```js
import { initializeGenerator, generate } from "tinybird-generator";

initializeGenerator({
  schema: z
    .object({})
    .optional()
    .default(presetSchemas["Web Analytics Starter Kit"])
    .refine(validateSchema), // Javascript object containing valid generator schema
  endpoint: z.string(), // Tinybird endpoint (eu_gcp, us_gcp or custom one)
  datasource: z.string(), // Name of the Tinybird datasource
  token: z.string(), // Tinybird admin token
  eps: z.number().optional().default(1), // Events per second
  limit: z.number().optional().default(-1), // Event limit
});

await generate();
```

### Preset schemas

```js
import { presetSchemas } from "tinybird-generator";

const schema = presetSchemas["Web Analytics Starter Kit"];

initializeGenerator({
  schema,
  ...
})

```
