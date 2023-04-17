# Schemas

Schemas are how you define what your mock data should look like. They are defined as JSON Objects, with each key representing a field in the data.

Each top-level key is the name of the field, in database terms, this would be your column name. Each key is an object, beneath which, you must define a `type` field. The value of the `type` field must be one of the supported [Data Types](./data_types.md). Some Data Type require parameters, which are supplied with a `params` key at the same level as the `type` key. The `params` key is also an object, beneath which you must supply the key-value pairs as required by the `type`.

It's very simple, but it can be easier to understand with an example. This is a valid Mockingbird schema:

```json
{
  "my_int": {
    "type": "int"
  },
  "my_random_values": {
    "type": "values",
    "params": {
        "values": [1,2,3]
    }
  }
}
```

The first object in our schema is `my_int`, which has the type [`int`](./data_types.md#int). The second object is `my_random_values`, which has the type [`values`](./data_types.md#values), and has additional parameters specified inside the `params` object.

The output of this schema would look like:

```json
{
    "my_int": 100,
    "my_random_values": 2
}
```

## Arrays

All types can be generated as arrays. Simply add a `count` key at the same level as the `type` key.

```json
{
  "my_int": {
    "type": "int",
    "count": 3
  }
}
```

## Preset Schemas

You can write your own custom schema, or use any of the preset schemas. 

You can find the definitions of all preset Schemas [here](https://github.com/tinybirdco/mockingbird/blob/main/packages/tinybird-generator/src/presetSchemas.ts). 

Contributions for more preset schemas are welcome!

### Default

The `default` schema is a basic default schema to get you started.

### z_sales

The `z-sales` schema is an example of e-commerce style sales data.

### Stock Prices

The `Stock Prices` schema is an example of a stock ticker data feed.

### Flights

The `Flights` schema is an example of a travel agent-style data feed.

### Content Tracking

The `Content Tracking` schema is an example of an event tracking data feed.

### Web Analytics Starter Kit

The `Web Analytics Starter Kit` allows you to generate mock data for the [Tinybird Web Analytics Starter Kit](https://github.com/tinybirdco/web-analytics-starter-kit).

### Log Analytics Starter Kit

The `Log Analytics Starter Kit` allows you to generate mock data for the [Tinybird Log Analytics Starter Kit](https://github.com/tinybirdco/log-analytics-starter-kit).
