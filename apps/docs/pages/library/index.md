# Mockingbird library

Mockingbird can be used as a library inside any application.

## Installation

The library is available from [npm](https://www.npmjs.com/package/@tinybirdco/mockingbird).

You can install it using `npm install @tinybirdco/mockingbird`

## Basic Usage

It's simple to embed Mockingbird into an application.

The most basic usage is to import one of the generators, initialize it and call `generate`.

```typescript
import {
  presetSchemas,
  TinybirdGenerator,
  generate,
} from "@tinybirdco/mockingbird";

const schema = presetSchemas["Simple Example"];

const tbGenerator = new TinybirdGenerator({
  schema,
  endpoint: "gcp_europe_west3",
  datasource: "test",
  token: "e.pXXXX",
  eps: 100,
  limit: -1,
});

await tbGenerator.generate();
```

If you are embedding Mockingbird inside a web page in a user's browser, we **strongly recommend** to call the `generate()` method inside a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). The Mockingbird UI takes this approach, so you can [use this as a reference implementation](https://github.com/tinybirdco/mockingbird/tree/main/apps/web/src/lib).
