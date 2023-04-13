# Data Types

You can find the definitions of all Data Types [here](https://github.com/tinybirdco/mockingbird/blob/main/packages/tinybird-generator/src/dataTypes.ts). 

Please feel free to contribute new Data Types!

## int

Returns a number, simple wrapper for Faker.js [`number`](https://fakerjs.dev/api/datatype.html#number) type.

**Parameters**

None

**Returns**

`123`

**Example usage**

```json
"my_int": {
    "type": "int"
}
```

## intString

Same as [int](#int), with the result returned as a String.

**Parameters**

None

**Returns**

`"123"`

**Example usage**

```json
"my_int_string": {
    "type": "intString"
}
```

## float

Returns a number, simple wrapper for Faker.js [`float`](https://fakerjs.dev/api/datatype.html#float) type.

**Parameters**

None

**Returns**

`123.1`

**Example usage**

```json
"my_float": {
    "type": "float"
}
```

## floatString

Same as [float](#float), with the result returned as a String.

**Parameters**

None

**Returns**

`"123.1"`

**Example usage**

```json
"my_float_string": {
    "type": "floatString"
}
```

## hex

Returns a hexidecimal string, simple wrapper for Faker.js [`hexadecimal`](https://fakerjs.dev/api/datatype.html#hexadecimal) type.

**Parameters**

None

**Returns**

`"0xaE13d044cB"`

**Example usage**

```json
"my_hex": {
    "type": "hex"
}
```

## string

Returns a string, simple wrapper for Faker.js [`string`](https://fakerjs.dev/api/datatype.html#string) type.

**Parameters**

None

**Returns**

`"TXcoYpSoHZ"`

**Example usage**

```json
"my_string": {
    "type": "string"
}
```

## first_name

Returns a first name string, simple wrapper for Faker.js [`firstname`](https://fakerjs.dev/api/name.html#firstname) type.

**Parameters**

None

**Returns**

`"Katharina"`

**Example usage**

```json
"my_first_name": {
    "type": "firstname"
}
```

## last_name

Returns a last name string, simple wrapper for Faker.js [`lastname`](https://fakerjs.dev/api/name.html#lastname) type.

**Parameters**

None

**Returns**

`"Johnson"`

**Example usage**

```json
"my_last_name": {
    "type": "lastname"
}
```

## full_name

Returns a full name string, simple wrapper for Faker.js [`fullname`](https://fakerjs.dev/api/name.html#fullname) type.

**Parameters**

None

**Returns**

`"Katharina Johnson"`

**Example usage**

```json
"my_name": {
    "type": "fullname"
}
```

## email

Returns an email string, simple wrapper for Faker.js [`email`](https://fakerjs.dev/api/internet.html#email) type.

**Parameters**

None

**Returns**

`"katharinajohnson@email.com"`

**Example usage**

```json
"my_email": {
    "type": "email"
}
```

## word

Returns a word string, simple wrapper for Faker.js [`noun`](https://fakerjs.dev/api/word.html#noun) type.

**Parameters**

None

**Returns**

`"mayor"`

**Example usage**

```json
"my_word": {
    "type": "word"
}
```

## domain

Returns a domain string, simple wrapper for Faker.js [`domain`](https://fakerjs.dev/api/internet.html#domainname) type.

**Parameters**

None

**Returns**

`"muddy-news.net"`

**Example usage**

```json
"my_domain": {
    "type": "domain"
}
```

## values

Takes an array of values, each loop of the generator picks a random item from the array. Values in the array can be any standard JSON types, e.g. numbers, strings, etc.

**Parameters**

- values: an array of values

**Returns**

`1`

**Example usage**

```json
"my_random_values": {
    "type": "values",
    "params": {
        "values": [1,2,3]
    }
}
```

## values_weighted

Similar to [values](#values), but with a weighted random. An additional parameters allows you to set the weighted frequency of each item, giving you control over the random distribution.

**Parameters**

- values: an array of values
- weights: an array of numbers

**Returns**

`1`

**Example usage**

```json
"weighted_random_values": {
    "type": "values_weighted",
    "params": {
        "values": [1,2,3],
        "weights": [92,6,2]
    }
}
```

## datetime 

Uses the Faker.js [`recent`](https://fakerjs.dev/api/date.html#recent) type to generate a time in the recent past, formats it as an ISO Date Time string (using `toISOString()`) with precision up to *seconds*.

**Parameters**

None

**Returns**

`"2023-04-06T17:31:57"`

**Example usage**

```json
"datetime": {
    "type": "datetime"
}
```

## datetime_range

Uses the Faker.js [`between`](https://fakerjs.dev/api/date.html#between) type to generate a time between two boundaries, formats it as an ISO Date Time string (using `toISOString()`) with precision up to *seconds*.

**Parameters**

- start: date string, start time boundary
- end: date string, end time boundary

**Returns**

`"2023-04-06T17:31:57"`

**Example usage**

```json
"date_between_boundaries": {
    "type": "datetime_range",
    "params": {
        "start": "2020-01-01T00:00:00.000Z", 
        "end": "2030-01-01T00:00:00.000Z"
    }
}
```

## timestamp

Same as [datetime](#datetime) but with millisecond precision.

**Parameters**

None

**Returns**

`"2023-04-07T04:02:32.372Z"`

**Example usage**

```json
"timestamp_now": {
    "type": "timestamp"
}
```

## timestamp_now 

Same as [timestamp](#timestamp) but using `now()` to get the latest system time when generating the record.

**Parameters**

None

**Returns**

`2023-04-06T17:31:57.342Z`

**Example usage**

```json
"my_timestamp_now": {
    "type": "timestamp_now"
}
```

## timestamp_range

Same as [datetime_range](#datetime_range) but with millisecond precision.

**Parameters**

- start: date string, start time boundary
- end: date string, end time boundary

**Returns**

`"2023-04-07T04:02:32.372Z"`

**Example usage**

```json
"timestamp_between_boundaries": {
    "type": "timestamp_range",
    "params": {
        "start": "2020-01-01T00:00:00.000Z", 
        "end": "2030-01-01T00:00:00.000Z"
    }
}
```

## range

Returns a number, simple wrapper for Faker.js [`number`](https://fakerjs.dev/api/datatype.html#number) type with the `min` and `max` parameters.

**Parameters**

- min: number, minimum boundary
- max: number, maximum boundary

**Returns**

`123`

**Example usage**

```json
"my_range": {
    "type": "range",
    "params": {
        "min": 1, 
        "max": 200
    }
}
```

## bool

Returns a boolean, simple wrapper for Faker.js [`boolean`](https://fakerjs.dev/api/datatype.html#boolean) type.

**Parameters**

None

**Returns**

`true`

**Example usage**

```json
"my_bool": {
    "type": "bool"
}
```

## uuid

Returns a uuid string, simple wrapper for Faker.js [`uuid`](https://fakerjs.dev/api/datatype.html#uuid) type.

**Parameters**

None

**Returns**

`"89bd9d8d-69a6-474e-8f46-7cc8796ed151"`

**Example usage**

```json
"my_uuid": {
    "type": "uuid"
}
```

## browser_name

A random browser name, from one of: "Chrome", "Firefox", "IE", "Opera".

**Parameters**

None

**Returns**

`"Chrome"`

**Example usage**

```json
"my_browser": {
    "type": "browser_name"
}
```

## browser_engine_name

A random browser engine name, from one of: "Blink", "Gecko", "Trident".

**Parameters**

None

**Returns**

`"Blink"`

**Example usage**

```json
"my_browser_engine": {
    "type": "browser_engine_name"
}
```

## city_name

Returns a city name string, simple wrapper for Faker.js [`cityName`](https://fakerjs.dev/api/address.html#cityname) type.

**Parameters**

None

**Returns**

`"Metairie"`

**Example usage**

```json
"my_city_name": {
    "type": "city_name"
}
```

## country_code_iso2

Returns an ISO Alpha-2 country code string, simple wrapper for Faker.js [`countryCode`](https://fakerjs.dev/api/address.html#countrycode) type, with the `alpha-2` parameter.

**Parameters**

None

**Returns**

`"MA"`

**Example usage**

```json
"my_country_code_iso2": {
    "type": "country_code_iso2"
}
```

## country_code_iso3

Returns an ISO Alpha-3 country code string, simple wrapper for Faker.js [`countryCode`](https://fakerjs.dev/api/address.html#countrycode) type, with the `alpha-2` parameter.

**Parameters**

None

**Returns**

`"MAS"`

**Example usage**

```json
"my_country_code_iso3": {
    "type": "country_code_iso3"
}
```

## operating_system

A random operating system name, from one of: "Linux", "Windows", "Mac OS".

**Parameters**

None

**Returns**

`"Mac OS"`

**Example usage**

```json
"my_operating_system": {
    "type": "operating_system"
}
```

## search_engine

A random search engine name, from one of: "https://www.google.co.uk/", "https://www.bing.com/", "https://duckduckgo.com/", "https://yandex.com/", "https://yahoo.com".

**Parameters**

None

**Returns**

`"https://yahoo.com"`

**Example usage**

```json
"my_search_engine": {
    "type": "search_engine"
}
```

## lat_or_lon_string

Returns a random Latitude string, which can be used as either a Lat or Lon, simple wrapper for Faker.js [`latitude`](https://fakerjs.dev/api/address.html#latitude) type.

**Parameters**

None

**Returns**

`"8.7864"`

**Example usage**

```json
"my_lat_or_lon_string": {
    "type": "lat_or_lon_string"
}
```

## lat_or_lon_int

Returns a random Latitude, which can be used as either a Lat or Lon, simple wrapper for Faker.js [`latitude`](https://fakerjs.dev/api/address.html#latitude) type.

**Parameters**

None

**Returns**

`8.7864`

**Example usage**

```json
"my_lat_or_lon_int": {
    "type": "lat_or_lon_int"
}
```

## words

Returns a string of multiple words, simple wrapper for Faker.js [`words`](https://fakerjs.dev/api/random.html#words) type.

**Parameters**

- amount: int, the amount of words to generate

**Returns**

`"copy Handcrafted bus client-server Point"`

**Example usage**

```json
"my_words": {
    "type": "words",
    "params": {
        "amount": 5
    }
}
```

## http_method

Returns a random HTTP method, simple wrapper for Faker.js [`httpMethod`](https://fakerjs.dev/api/internet.html#httpmethod) type.

**Parameters**

None

**Returns**

`"POST"`

**Example usage**

```json
"my_http_method": {
    "type": "http_method"
}
```

## user_agent

Returns a random User Agent string, simple wrapper for Faker.js [`userAgent`](https://fakerjs.dev/api/internet.html#useragent) type.

**Parameters**

None

**Returns**

`"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT"`

**Example usage**

```json
"my_user_agent": {
    "type": "user_agent"
}
```

## semver

Returns a random semver string, simple wrapper for Faker.js [`semver`](https://fakerjs.dev/api/system.html#semver) type.

**Parameters**

None

**Returns**

`"5.5.7"`

**Example usage**

```json
"my_semver": {
    "type": "semver"
}
```
