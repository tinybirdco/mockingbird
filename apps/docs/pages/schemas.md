# Schemas

Schemas are how you define what your mock data should look like. They are defined as JSON Objects, with each key representing a field in the data.

Each top-level key is the name of the field, in database terms, this would be your column name. Each key is an object, beneath which, you must define a `type` field. The value of the `type` field must be one of the supported [Data Types](./data_types.md). Some Data Type require parameters, which are supplied with a `params` key at the same level as the `type` key. The `params` key is also an object, beneath which you must supply the key-value pairs as required by the `type`.

It's very simple, but it can be easier to understand with an example. This is a valid Mockingbird schema:

```json
{
  "some_int": {
    "type": "mockingbird.int"
  },
  "some_values": {
    "type": "mockingbird.pick",
    "params": [
      {
        "values": [
          123,
          456
        ]
      }
    ]
  }
}
```

The first object in our schema is `some_int`, which has the type `int`. The second object is `some_values`, which has the type [`values`](./data_types.md#pick), and has additional parameters specified inside the `params` object.

The output of this schema would look like:

```json
{
    "some_int": 100,
    "some_values": 123
}
```

## Arrays

All types can be generated as arrays. Simply add a `count` key at the same level as the `type` key.

```json
{
  "some_int": {
    "type": "mockingbird.int",
    "count": 3
  }
}
```

## Preset Schemas

You can write your own custom schema, or use any of the preset schemas.

You can find the definitions of all preset Schemas [here](https://github.com/tinybirdco/mockingbird/blob/main/packages/mockingbird/src/presetSchemas.ts).

Contributions for more preset schemas are welcome!

### Simple Example

The `Simple Example` schema is a basic default schema to get you started.

### eCommerce Transactions

The `eCommerce Transactions` schema is an example of e-commerce style sales data.

### Stock Prices

The `Stock Prices` schema is an example of a stock ticker data feed.

### Flight Bookings

The `Flight Bookings` schema is an example of a travel agent-style data feed.

### Content Tracking

The `Content Tracking` schema is an example of an event tracking data feed.

### Web Analytics Starter Kit

The `Web Analytics Starter Kit` allows you to generate mock data for the [Tinybird Web Analytics Starter Kit](https://github.com/tinybirdco/web-analytics-starter-kit).

### Log Analytics Starter Kit

The `Log Analytics Starter Kit` allows you to generate mock data for the [Tinybird Log Analytics Starter Kit](https://github.com/tinybirdco/log-analytics-starter-kit).
