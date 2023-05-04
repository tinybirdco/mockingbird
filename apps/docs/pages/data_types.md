# Data Types

Mockingbird provides a wide range of different Data Types for generating mock data. Most of these Data types come from [`faker.js`](https://fakerjs.dev).

All faker.js types are supported, and can be referenced in Mockingbird using the fully qualified name of the type, meaning both the module name and the type name, separated by a dot (.). For example, to use the faker.js type [`buildingNumber`](https://fakerjs.dev/api/address.html#buildingnumber) you should use `address.buildingNumber`.

On top of faker.js types, Mockingbird also has some custom Data Types. These are types that aren't provided by faker.js but can be very useful. You can find the definitions of all the custom Data Types [here](https://github.com/tinybirdco/mockingbird/blob/main/packages/mockingbird/src/extendedFaker.ts). 

Contributions to add new custom Data Types are welcome!

## Mockingbird custom Data Types

This section documents the **custom Data Types** that are added on top of Faker.js. For documentation about Faker.js types, please [see the Faker.js docs](https://fakerjs.dev/api/).

Note that all Mockingbird custom Data Types have the prefix `mockingbird`, e.g. `mockingbird.osName`.

### pick

Takes an array of values, each loop of the generator picks a random item from the array. Values in the array can be any standard JSON types, e.g. numbers, strings, etc.

**Parameters**

- values: an array of values

**Returns**

`123`

**Example usage**

```json
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
```

### pickWeighted

Similar to [values](#values), but with a weighted random. An additional parameters allows you to set the weighted frequency of each item, giving you control over the random distribution.

**Parameters**

- values: an array of values
- weights: an array of numbers

**Returns**

`123`

**Example usage**

```json
"values_weighted": {
    "type": "mockingbird.pickWeighted",
    "params": [
        {
            "values": [
                123,
                456,
                789
            ],
            "weights": [
                90,
                7,
                3
            ]
        }
    ]
}
```

### datetimeNow 

Take the current times and formats it into an ISO Date Time string (using `toISOString()`) with precision up to *seconds*.

**Parameters**

None

**Returns**

`"2023-04-06T17:31:57"`

**Example usage**

```json
"my_datetime": {
    "type": "mockingbird.datetimeNow"
}
```

### datetimeRecent

Uses Faker.js [`date.recent()`](https://fakerjs.dev/api/date.html#recent) and formats it into an ISO Date Time string (using `toISOString()`) with precision up to *seconds*.

**Parameters**

None

**Returns**

`"2023-04-06T17:31:57"`

**Example usage**

```json
"my_datetime": {
    "type": "mockingbird.datetimeRecent"
}
```

### datetimeBetween

Uses Faker.js [`date.between`](https://fakerjs.dev/api/date.html#between) to generate a time between two boundaries, formats it as an ISO Date Time string (using `toISOString()`) with precision up to *seconds*.

**Parameters**

- start: date string, start time boundary
- end: date string, end time boundary

**Returns**

`"2023-04-06T17:31:57"`

**Example usage**

```json
"date_between_boundaries": {
    "type": "mockingbird.datetimeBetween",
    "params": [
        {
            "start": "2020-01-01T00:00:00.000Z", 
            "end": "2030-01-01T00:00:00.000Z"
        }
    ]
}
```

### timestampNow

Take the current time and formats it into an ISO Date Time string (using `toISOString()`) with precision to *nanoseconds*.

**Parameters**

None

**Returns**

`2023-04-06T17:31:57.342Z`

**Example usage**

```json
"my_timestamp": {
    "type": "mockingbird.timestampNow"
}
```

### browserName

A random browser name, from one of: "Chrome", "Firefox", "IE", "Opera".

**Parameters**

None

**Returns**

`"Chrome"`

**Example usage**

```json
"my_browser": {
    "type": "mockingbird.browserName"
}
```

### browserEngineName

A random browser engine name, from one of: "Blink", "Gecko", "Trident".

**Parameters**

None

**Returns**

`"Blink"`

**Example usage**

```json
"my_browser_engine": {
    "type": "mockingbird.browserEngineName"
}
```

### osName

A random operating system name, from one of: "Linux", "Windows", "Mac OS".

**Parameters**

None

**Returns**

`"Mac OS"`

**Example usage**

```json
"my_operating_system": {
    "type": "mockingbird.osName"
}
```

### searchEngineName

A random search engine name, from one of: "https://www.google.co.uk/", "https://www.bing.com/", "https://duckduckgo.com/", "https://yandex.com/", "https://yahoo.com".

**Parameters**

None

**Returns**

`"https://yahoo.com"`

**Example usage**

```json
"my_search_engine": {
    "type": "mockingbird.searchEngineName"
}
```
