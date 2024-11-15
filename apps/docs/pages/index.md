# Mockingbird

Mockingbird is a mock streaming data generator. 

It is FOSS & available as a library, CLI or UI.

You can self-host the UI, or use [Tinybird's hosted one](https://mockingbird.tinybird.co).

## Destinations

Mockingbird can send to any HTTP endpoint using Destinations.

Current Destinations are:

- [Ably](./destinations/ably.md)
- [AWS SNS](./destinations/aws_sns.md)
- [Confluent Cloud Kafka](./destinations/confluent_cloud_kafka.md)
- [Tinybird](./destinations/tinybird.md)

Missing your favourite destination? Please [contribute a Destination](https://github.com/tinybirdco/mockingbird)!

## Architecture

Mockingbird is written in TypeScript.

[Faker.js](https://fakerjs.dev/) is used under the hood to provide many of the mock Data Types. Faker.js is extended with additional custom Data Types.

Mockingbird is a library, which can be used like any other package and [installed from npm](https://www.npmjs.com/package/@tinybirdco/mockingbird).

As well as the library, there are standalone [CLI](https://www.npmjs.com/package/@tinybirdco/mockingbird-cli) and [UI](https://mockingbird.tinybird.co) applictions.

In the UI application, the data generation is performed inside a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) which prevents it from locking up your browser's main thread.

Data generation is separated from the logic that sends data to the final destination. This enables Mockingbird to support sending data to many different downstream systems, which are called 'Destinations'.

## Contributing

Mockingbird is Free Open-Source Software, licensed under the Apache 2.0 license. We encourage anyone to contribute to the project.

Feel free to contribute a new Destination, or raise a GitHub issue to request one. 

Vendors are welcome to contribute Destinations for their own tools!
