![Mockingbird Logo](assets/logo/logo_white.png)

# Mockingbird

Mockingbird is mock streaming data generator built by [Tinybird](https://tinybird.co).

It can be used as a library in other projects, or on its own via the UI or CLI.

Mockingbird can send data to any downstream HTTP endpoint through Destination plugins. If you don't see a Destination that you want, feel free to request it or contribute it!

If you simply want to use the Web UI, you use the hosted one here: [https://mockingbird.tinybird.co/](https://mockingbird.tinybird.co/)

## Docs

Find the docs at [https://mockingbird.tinybird.co/docs](https://mockingbird.tinybird.co/docs)

## Usage

### Web UI

The Web UI provides and easy to use, guided experience. It should be pretty easy to get started with, so give it a go!

If you need help with defining schemas, or configuring particular Destinations, you can find more complete documentation [here](https://mockingbird.tinybird.co/docs).

### Passing params in the URL

If you want to re-use configurations from a previous session, you can simply save the URL. All settings are saved as parameters in the URL, so you can re-use and share configs with your team. For example: [http://localhost:3000/?schema=z_sales&eps=1&host=eu_gcp&datasource=sales_dg&token=p.eyJ1IjogIjg4Nzk5NGUxLWZmNmMtNGUyMi1iZTg5LTNlYzBmNmRmMzlkZCIsICJpZCI6ICIwN2RlZThhMS0wNGMzLTQ4OTQtYmQxNi05ZTlkMmM3ZWRhMTgifQ.p_N4EETK7dbxOgHtugAUue3BUWwyGHT461Ha8P-d3Go](http://localhost:3000/?schema=z_sales&eps=1&host=eu_gcp&datasource=sales_dg&token=p.eyJ1IjogIjg4Nzk5NGUxLWZmNmMtNGUyMi1iZTg5LTNlYzBmNmRmMzlkZCIsICJpZCI6ICIwN2RlZThhMS0wNGMzLTQ4OTQtYmQxNi05ZTlkMmM3ZWRhMTgifQ.p_N4EETK7dbxOgHtugAUue3BUWwyGHT461Ha8P-d3Go)

**Warning**: all settings are saved in the URL including senstive field such as tokens & passwords! This is helpful in many occasions for demos, POCs and tests where these credentials are short-lived and disposable - but take care if you are using credentials that must not be shared!

### CLI

Mockingbird is available as a standalone CLI.

Install the CLI with:

```
npm install @tinybirdco/mockingbird-cli
```

Here is an example of sending data to the Tinybird Events API:

```sh
> mockingbird-cli \
  --generator tinybird
  --schema schema.txt \
  --tb-datasource "my_data_source" \
  --tb-token "e.Pdjdbfsbhksd...." \
  --tb-endpoint eu_gcp \
  --eps 50 \
  --limit 200
```

## Contributing

All contributions are welcome! We encourages individuals & commerical vendors to contribute to Mockingbird to build a data generator that works for everyone.

The repository has the following structure:

```bash
├── apps
│   ├── cli
│   ├── docs
│   └── web
└── packages
    └── tinybird-generator
```

### Generator

The core Mockingbird generator is under `./packages/tinybird-generator`. All new Data Types, Schemas and Destinations are added here.

The generator is written in TypeScript & uses [Faker.js](https://fakerjs.dev/) under the hood to power much of the fake data generation. Custom Data Types are added on-top of Faker to supplement where needed.

#### Adding new Data Types

DataTypes are defined in [/packages/tinybird-generator/src/schemaTypes.ts](./packages/tinybird-generator/src/schemaTypes.ts).

To add a new Data Type, add a new item to the `schemaTypes` object.

They key of the item will become the name of the Data Type. Ensure that you choose a name that does not clash with an existing Faker.js or custom type.

The value of the item must be the `createSchemaValue()` function. The `createSchemaValue` function has 1 required parameter, and 1 optional parameter. The first parameter must be a valid function, and this function is used to generate the fake data. The second (optional) parameter, is a [Zod validator](https://zod.dev/) for any parameters required by your new Data Type. This validator is only required if your generator function accepts incoming parameters, otherwise you can ignore it.

For example, a custom Data Type that takes no input params:

```javascript
http_method: createSchemaValue(() => extendedFaker.internet.httpMethod())
```

A custom Data Type that accepts incoming parameters & has a validator:

```javascript
values: createSchemaValue(
    (params) => params.values[Math.floor(Math.random() * params.values.length)],
    z.object({ values: z.array(z.any()) })
),
```

#### Adding mew preset Schemas

Preset Schemas are defined in [/packages/tinybird-generator/src/presetSchemas.ts](./packages/tinybird-generator/src/presetSchemas.ts).

To add a new Schema, add a new item to the `presetSchemas` object.

They key of the item will become the name of the Schema. Ensure that you choose a name that does not clash with an existing preset Schema.

The value of the item is an object that defined the Schema, just as you would define it via the Web UI.

```javascript
Default: {
    some_int: {
        type: "int",
    },
    some_values: {
        type: "values",
        params: {
        values: [123, 456],
        },
    },
    values_weighted: {
        type: "values_weighted",
        params: {
        values: [123, 456, 789],
        weights: [90, 7, 3],
        },
    },
},
```

### CLI

The CLI is under `./apps/cli`

The CLI is Node based and uses [`yargs`](https://github.com/yargs/yargs).

### Web UI

The Web UI is under `./apps/web`

The Web UI is a Next.js application written in TypeScript.

#### Running the local dev server

To run the Mockingbird UI locally, first install Node.js (developed using v18).

Then, use these commands:

```
git clone https://github.com/tinybirdco/mockingbird.git
cd mockingbrid
npm install
npm run dev
```

This will serve both the Web UI & the documentation site locally. By default, the UI is available on `http://localhost:3001` and the docs are on `http://localhost:3000`.

### Docs

The Docs are under `./apps/docs`

The Docs are written in MDX using [Nextra](https://nextra.site/) as a static site generator.

To run the docs locally, see the instructions for the running the [Web UI](#running-the-local-dev-server).
