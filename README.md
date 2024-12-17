![Mockingbird Logo](assets/logo/logo_white.png)

# Mockingbird

Mockingbird is mock streaming data generator built by [Tinybird](https://tinybird.co).

It can be used as a library in other projects, or on its own via the UI or CLI.

Mockingbird can send data to any downstream HTTP endpoint through Destination plugins. If you don't see a Destination that you want, feel free to request it or contribute it!

If you simply want to use the Web UI, you use the hosted one here: [https://mockingbird.tinybird.co/](https://mockingbird.tinybird.co/)

## Usage

### Web UI

The Web UI provides and easy to use, guided experience. It should be pretty easy to get started with, so give it a go!

If you need help with defining schemas, or configuring particular Destinations, you can find more complete documentation [here](https://mockingbird.tinybird.co/docs).

#### Passing params in the URL

If you want to re-use configurations from a previous session, you can simply save the URL. All settings are saved as parameters in the URL, so you can re-use and share configs with your team. For example: [http://localhost:3000/?schema=z_sales&eps=1&host=gcp_europe_west3&datasource=sales_dg&token=p.eyJ1IjogIjg4Nzk5NGUxLWZmNmMtNGUyMi1iZTg5LTNlYzBmNmRmMzlkZCIsICJpZCI6ICIwN2RlZThhMS0wNGMzLTQ4OTQtYmQxNi05ZTlkMmM3ZWRhMTgifQ.p_N4EETK7dbxOgHtugAUue3BUWwyGHT461Ha8P-d3Go](http://localhost:3000/?schema=z_sales&eps=1&host=gcp_europe_west3&datasource=sales_dg&token=p.eyJ1IjogIjg4Nzk5NGUxLWZmNmMtNGUyMi1iZTg5LTNlYzBmNmRmMzlkZCIsICJpZCI6ICIwN2RlZThhMS0wNGMzLTQ4OTQtYmQxNi05ZTlkMmM3ZWRhMTgifQ.p_N4EETK7dbxOgHtugAUue3BUWwyGHT461Ha8P-d3Go)

**Warning**: all settings are saved in the URL including senstive field such as tokens & passwords! This is helpful in many occasions for demos, POCs and tests where these credentials are short-lived and disposable - but take care if you are using credentials that must not be shared!

### CLI

Mockingbird is available as a standalone CLI.

Install the CLI with:

```
npm install @tinybirdco/mockingbird-cli
```

Here is an example of sending data to the Tinybird Events API:

```sh
> mockingbird-cli tinybird
  --schema schema.json \
  --datasource "my_data_source" \
  --token "e.Pdjdbfsbhksd...." \
  --endpoint gcp_europe_west3 \
  --eps 50 \
  --limit 200
```

## Destinations

### Tinybird

[Tinybird](https://www.tinybird.co/) is a real-time data platform.

|  Web  |  CLI  |
| :---: | :---: |
|  Yes  |  Yes  |

| Name        |                             Description                             |        Example value |
| :---------- | :-----------------------------------------------------------------: | -------------------: |
| Data Source |        The name of the Tinybird Data Source to send data to         |       my_data_source |
| Auth Token  | The Auth Token with WRITE permissions on the configured Data Source | p.ePjdfbsdjnfeunf... |
| Region      |          The Tinybird Region of the configured Data Source          |                   EU |
| EPS         |     (Events Per Second) How many events per second to generate      |                 1000 |
| Limit       |            Max number of rows to send (-1 for unlimited)            |                   -1 |

### Ably

[Ably](https://ably.com/) reliably distributes realtime data to your users using the publish/subscribe messaging pattern over WebSocket connections.

|  Web  |  CLI  |
| :---: | :---: |
|  Yes  |  Yes  |

| Name       |                        Description                         | Example value |
| :--------- | :--------------------------------------------------------: | ------------: |
| API Key    |           Ably API key for basic authentication            |     xVLyHw... |
| Channel ID |      The ID of the channel to which the data is send       |  rest-example |
| EPS        | (Events Per Second) How many events per second to generate |          1000 |
| Limit      |       Max number of rows to send (-1 for unlimited)        |            -1 |

### AWS Kinesis

[AWS Kinesis](https://aws.amazon.com/kinesis/) is a fully managed, scalable, and real-time data streaming service. It can continuously capture gigabytes of data per second from hundreds of thousands of sources, making it ideal for real-time analytics, application logs, and IoT device data.

|  Web  |  CLI  |
| :---: | :---: |
|  No   |  Yes  |

| Name              |                        Description                         |   Example value |
| :---------------- | :--------------------------------------------------------: | --------------: |
| Region            |                         AWS region                         |       us-east-1 |
| Access Key ID     |                      AWS credentials                       |     accessKeyId |
| Secret Access Key |                      AWS credentials                       | secretAccessKey |
| streamName        |       The name of the stream you want to publish to        |  my-stream-name |
| partitionKey      |   Partition key to use for the data. Random by default.    |              "" |
| kinesisOptions    |       Any additional options passed to KinesisClient       |              {} |
| EPS               | (Events Per Second) How many events per second to generate |            1000 |
| Limit             |       Max number of rows to send (-1 for unlimited)        |              -1 |

### AWS SNS

[AWS SNS](https://aws.amazon.com/sns/) is a fully managed Pub/Sub service for A2A and A2P messaging.

|  Web  |  CLI  |
| :---: | :---: |
|  Yes  |  Yes  |

| Name              |                                 Description                                  |             Example value |
| :---------------- | :--------------------------------------------------------------------------: | ------------------------: |
| Region            |                                  AWS region                                  |                 us-east-1 |
| Access Key ID     |                               AWS credentials                                |               accessKeyId |
| Secret Access Key |                               AWS credentials                                |           secretAccessKey |
| Topic ARN         |                       The topic you want to publish to                       | arn:aws:sns:us-east-1:... |
| Subject           | Used as the "Subject" line when the message is delivered to email endpoints. |                        "" |
| SNS Options       |                  Any additional options passed to SNSClient                  |                        {} |
| EPS               |          (Events Per Second) How many events per second to generate          |                      1000 |
| Limit             |                Max number of rows to send (-1 for unlimited)                 |                        -1 |

### Confluent Cloud Kafka

[Confluent Cloud Kafka](https://www.confluent.io/) is a cloud-native, fully managed Kafka service.

|  Web  |  CLI  |
| :---: | :---: |
|  No   |  Yes  |

| Name          |                        Description                         |                                          Example value |
| :------------ | :--------------------------------------------------------: | -----------------------------------------------------: |
| REST endpoint |                        Endpoint URL                        | https://pkc-zpjg0.eu-central-1.aws.confluent.cloud:443 |
| Cluster ID    |                      Kafka cluster ID                      |                                             p0s-f23... |
| Topic         |                        Kafka Topic                         |                                                topic_1 |
| API Key       |                     Confluent API Key                      |                                              FXVLSF... |
| API Secret    |                    Confluent API Secret                    |                                             GxvPswX... |
| Headers       |                      Optional headers                      |                                                     {} |
| Key           |           Optional key to use for partitioning.            |                                                     {} |
| EPS           | (Events Per Second) How many events per second to generate |                                                   1000 |
| Limit         |       Max number of rows to send (-1 for unlimited)        |                                                     -1 |


# Google Spanner

[Google Spanner](https://cloud.google.com/spanner) is a relational, key-value, graph, and vector database. It is a highly scalable database that combines unlimited scalability with relational semantics, such as secondary indexes, strong consistency, schemas, and SQL providing 99.999% availability in one easy solution.

|  Web  |  CLI  |
| :---: | :---: |
|  No   |  Yes  |

| Name        |                Description                |    Example value |
| :---------- | :---------------------------------------: | ---------------: |
| projectId   |              GCP Project ID               |   myfirstproject |
| instanceId  |            Spanner Instance ID            |       myinstance |
| databaseId  |            Spanner Database ID            |       mydatabase |
| table       |            Spanner Table Name             |          mytable |
| keyFilename | Path to GCP Service Account Key JSON file | ../my.creds.json |

# RabbitMQ

RabbitMQ is a popular open source message broker.

|  Web  |  CLI  |
| :---: | :---: |
|  No   |  Yes  |

| Name               |               Description                |        Example value |
| :----------------- | :--------------------------------------: | -------------------: |
| Endpoint           |            RabbitMQ endpoint             |     amqp://localhost |
| Queue              |              RabbitMQ queue              |             my-queue |
| AssertQueueOptions | RabbitMQ assertQueue options JSON string |   {"expires": 60000} |
| PublishOptions     |   RabbitMQ publish options JSON string   | {"persistent": true} |


## Contributing

All contributions are welcome! We encourages individuals & commerical vendors to contribute to Mockingbird to build a data generator that works for everyone.

The repository has the following structure:

```bash
├── apps
│   ├── cli
│   ├── docs
│   └── web
└── packages
    └── mockingbird
```

### Generator

The core Mockingbird generator is under `./packages/mockingbird`. All new Data Types, Schemas and Destinations are added here.

The generator is written in TypeScript & uses [Faker.js](https://fakerjs.dev/) under the hood to power much of the fake data generation. Custom Data Types are added on-top of Faker to supplement where needed.

#### Adding new Data Types

Data Types are defined in [/packages/mockingbird/src/extendedFaker.ts](./packages/mockingbird/src/extendedFaker.ts).

To add a new Data Type, add a new item to the `mockingbirdModule` object.

They key of the item will become the name of the Data Type. Types added to this module are automatically added to the `mockingbird` namespace, meaning that they are referenced in schemas like `mockingbird.myTypeName`, this avoids clashes with Faker.js types.

The value of the item must be a function that returns the desired value. The function can have 1 optional parameter, which allows the function to accept incoming parameters.

For example, a custom Data Type that takes no input params:

```javascript
myCustomType: () => "I return this awesome string!",
```

A custom Data Type that accepts incoming parameters:

```javascript
pick: (params: number) =>
    params.values[Math.floor(Math.random() * params)],
```

The `params` are passed directly to the function as-is, so they can be any type you like.

#### Adding new preset schemas

Preset schemas are defined in [/packages/mockingbird/src/schemas/](./packages/mockingbird/src/schemas).

Create a new file in the `./packages/mockingbird/src/schemas/` directory.

The contents of the file should look like this:

```javascript
import { Schema } from "../types";

export const newSchema: Schema = {
  timestamp: {
    type: "mockingbird.timestampNow",
  },
};

```

Ensure a new schema is exported in [./packages/mockingbird/src/schemas/index.ts](./packages/mockingbird/src/schemas/index.ts)

### CLI

The CLI is under `./apps/cli`

The CLI is Node based and uses [`yargs`](https://github.com/yargs/yargs).

### Web UI

The Web UI is under `./apps/web`

The Web UI is a Next.js application written in TypeScript.

#### Running the local dev server

To run the Mockingbird UI locally, first install Node.js (developed using v18).

Then, use these commands:

```bash
git clone https://github.com/tinybirdco/mockingbird.git
cd mockingbird
npm install
npm run dev
```

This will serve both the Web UI & the documentation site locally. By default, the UI is available on `http://localhost:3001` and the docs are on `http://localhost:3000`.