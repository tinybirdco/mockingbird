# Mockingbird

Mockingbird is dummy-data generator built by [Tinybird](https://tinybird.co).

Mockingbird can be used as a package in other projects, or on its own via the UI or CLI.

Data is generted in NDJSON format, and pushed to an HTTP endpoint. You can use it to send data to Tinybird via the [Tinybird Events API](https://www.tinybird.co/docs/guides/ingest-from-the-events-api.html).

Go to [https://mockingbird.tinybird.co/](https://mockingbird.tinybird.co/)
or alternatively run it [locally](#local-install) on your machine.

![Generator UI!](/readme/img/ui.png "Generator UI")

## Local Install

To run the generator locally, first install Node.js (developed using v18 lts/hydrogen).

Then:

1. Clone this monorepo: `git clone https://github.com/tinybirdco/mockingbird.git`
2. Install dependencies with npm: `npm install`

Repository has the following structure:

```bash
├── apps
│   ├── cli
│   └── web
└── packages
    └── tinybird-generator
```

## Web

### How To Use

1. Run the development server: `npm run dev`. The web app will be available on [http://localhost:3000](http://localhost:3000).
2. Input your Tinybird config by clicking the __Tinybird Settings__ button in the top right & click __Save__.
3. Customise the schema in the text box on the left & click __Save__. This will first validate that it is valid JSON, and second, validate that you have used known data types. If you pass validation, you'll see a preview of your data on the right.
4. Click the __Generate!__ button to start sending data to Tinybird.

### Passing params in the URL

To allow faster demoing, you can pass the desired params in the url. E.g., [http://localhost:3000/?schema=z_sales&eps=1&host=eu_gcp&datasource=sales_dg&token=p.eyJ1IjogIjg4Nzk5NGUxLWZmNmMtNGUyMi1iZTg5LTNlYzBmNmRmMzlkZCIsICJpZCI6ICIwN2RlZThhMS0wNGMzLTQ4OTQtYmQxNi05ZTlkMmM3ZWRhMTgifQ.p_N4EETK7dbxOgHtugAUue3BUWwyGHT461Ha8P-d3Go](http://localhost:3000/?schema=z_sales&eps=1&host=eu_gcp&datasource=sales_dg&token=p.eyJ1IjogIjg4Nzk5NGUxLWZmNmMtNGUyMi1iZTg5LTNlYzBmNmRmMzlkZCIsICJpZCI6ICIwN2RlZThhMS0wNGMzLTQ4OTQtYmQxNi05ZTlkMmM3ZWRhMTgifQ.p_N4EETK7dbxOgHtugAUue3BUWwyGHT461Ha8P-d3Go)

***
__NOTE:__ shown token has been deprecated so it won't work
***

### Passing predefined Schemas

Apart from passing the schema templates —`schema=z_sales`— as you can see [above](#passing-params-in-the-url), you can also pass a hash that contains the JSON Schema.
This way you can save it for later and using it for quick demos.

To generate new valid schemas without [adding default templates](#adding-new-default-templates) you can simply edit the JSON in the Schema Builder, click on Save, and, if it is a valid one, a new hash of the JSON will be saved in the url. E.g., `schema=XQAAAAJxAQAAAAAAAABtAElZc5EUiPjRVsymUw6kCv7vrUcchRGo2mUJw1XM3QbdEbjcCYxEyOlqpifLRoogkVAEtr4ISWOmu33DlLoNC_p6GQaSv1x6BIitOL-wxXI56XzsFLA0JJEAl4NmVrBsCzjgHzv0MIgS5NF7EEnU7qypT5jWdjF8Svh9vy1epdoW6QCBCYbevwnEVck6v-SvIsw5D_ggGs7AOZMlRRwbj4gl_57mYFDOcqi2AXzhPmmQNKpmf3EaZWtzauwCUNUmU7u57rgynqMaWgZTysoukECAVA1mIPGEI3cMA0C-l7kRc_J7qCpAObcGfciJ_XYA1AiiWylgDcU4BxXTY3D4DhFX_r1oIA`

## CLI

The tool has a CLI mode you can use:

```sh
> node cli/index.js --schema schema.txt \
  --datasource $DS_NAME \
  --token $TB_TOKEN \
  --endpoint eu_gcp \
  --eps 50 \
  --limit 200
```

And for your local Tinybird development environment:

```sh
> TB_ENDPOINT=http://localhost:8300 \
    node cli/index.js --schema schema.txt \
    --datasource $DS_NAME \
    --token $TB_TOKEN \
    --endpoint custom \
    --eps 50 \
    --limit 200
```

## DataTypes

See [/packages/tinybird-generator/src/dataTypes.ts](./packages/tinybird-generator/src/dataTypes.ts) for DataTypes supported in schemas. We use [Faker](https://fakerjs.dev/) to generate random data with some custom extensions. Not all Faker types are exposed, only types explicitly added via `dataTypes.ts` can be used in schemas.

Current types are:

```txt
int
intString
float
floatString
hex
string
first_name
last_name
full_name
email
word
domain
values
values_weighted
datetime //values up to the second -> DateTime
timestamp //values up to the millisecond -> DateTime64(3)
range //supports two params:  'params': ['start', 'end'] and returns ints between the params
timestamp_range
datetime_range
uuid
bool
browser_name
browser_engine_name
city_name
country_code_iso2
operating_system
search_engine
lat_or_lon_string
lat_or_lon_int
words
http_method
user_agent
semver
```

### Adding new DataTypes

DataTypes are defined in [/packages/tinybird-generator/src/dataTypes.ts](./packages/tinybird-generator/src/dataTypes.ts).

To add a new DataType, add a new object to the data type array.

Requires properties:

`tinybird_type` - The Type to use for the column in Tinybird (Current not implemented)

`generator` - A function that generates and returns the actual value to use in the data

Optional properties:

`params` - An array of key names to use for input parameters

`param_validator` - A function that validates incoming parameters and returns true/false

For example, a minimal type takes no input params, thus requires no param validator:

```javascript
    'int': {
        'tinybird_type': 'int',
        generator() {
            return Math.floor(Math.random() * 100) + 1;
        }
    },
```

A more complex type can take input parameters and must provide a validator:

```javascript
    'values': {
        'tinybird_type': 'string',
        'params': ['values'],
        'param_validator': function (params) {
            const validators = [
                param_validators.length,
                param_validators.keys
            ]
            return RunValidators(validators, this.params, params);
        },
        'generator': function (params) {
            return params.values[Math.floor(Math.random() * params.values.length)];
        }
    },
```

### Adding new default templates

Templates are defined in [/packages/tinybird-generator/src/presetSchemas.ts](./packages/tinybird-generator/src/presetSchemas.ts).

To add a new template, add a new property containing the schema to the presetSchemas object.

```javascript
export const presetSchemas = {
    'default': {
        "some_int": {
            "type": "int"
        },
        "some_values": {
            "type": "values",
            "params": {
                "values": [123, 456]
            }
        },
        "values_weighted": {
            "type": "values_weighted",
            "params": {
                "values": [123, 456, 789],
                "weights": [90, 7, 3]
            }
        }
    },
    'acme store': {
        "datetime": {
            "type": "datetime"
        },
        "article_id": {
            "type": "values",
            "params": {
                "values": [709138001,517762001,675068002,712216001,507909003,762846008,469039019,631878001,697054003,682511001,618800001,710056003,507910001,470985003,697054014,762846001,762846007,721435001,734460001,762846006,581298005,682509001,502224001,850917001,622955001,695632001,349301001,507909001,859125001,623115001,622958003,716672001]
            }
        },
        "customer_id": {
            "type": "string"
        }
    }
}
```
