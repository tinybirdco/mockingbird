import {
  AblyGenerator,
  AWSSNSGenerator,
  ConfluentCloudKafkaGenerator,
  RabbitMQGenerator,
  TinybirdGenerator,
  UpstashKafkaGenerator,
} from "@tinybirdco/mockingbird";

export const subcommands = [
  {
    name: "ably",
    generator: AblyGenerator,
    options: {
      apiKey: {
        describe: "Ably API Key",
        demandOption: true,
      },
      channelId: {
        describe: "Ably Channel ID",
        demandOption: true,
      },
    },
  },
  {
    name: "aws-sns",
    generator: AWSSNSGenerator,
    options: {
      region: {
        describe: "AWS Region",
        demandOption: true,
      },
      accessKeyId: {
        describe: "AWS Access Key ID",
        demandOption: true,
      },
      secretAccessKey: {
        describe: "AWS Secret Access Key",
        demandOption: true,
      },
      topicArn: {
        describe: "AWS SNS Topic ARN",
        demandOption: true,
      },
      subject: {
        describe: "AWS SNS Subject",
      },
      snsOptions: {
        describe: "AWS SNS Options JSON string",
      },
    },
    middlewares: [
      (argv) => ({
        snsOptions: argv.snsOptions ? JSON.parse(argv.snsOptions) : undefined,
      }),
    ],
  },
  {
    name: "confluent-cloud-kafka",
    generator: ConfluentCloudKafkaGenerator,
    options: {
      restEndpoint: {
        describe: "Confluent Cloud Kafka REST endpoint",
        demandOption: true,
      },
      clusterId: {
        describe: "Confluent Cloud Kafka cluster ID",
        demandOption: true,
      },
      topic: {
        describe: "Confluent Cloud Kafka topic",
        demandOption: true,
      },
      apiKey: {
        describe: "Confluent Cloud Kafka API Key",
        demandOption: true,
      },
      apiSecret: {
        describe: "Confluent Cloud Kafka API Secret",
        demandOption: true,
      },
      headers: {
        describe: "Confluent Cloud Kafka headers JSON string",
      },
      key: {
        describe: "Confluent Cloud Kafka key JSON string",
      },
    },
    middlewares: [
      (argv) => ({
        headers: argv.headers ? JSON.parse(argv.headers) : undefined,
      }),
      (argv) => ({
        key: argv.key ? JSON.parse(argv.key) : undefined,
      }),
    ],
  },
  {
    name: "rabbitmq",
    generator: RabbitMQGenerator,
    options: {
      endpoint: {
        describe: "RabbitMQ endpoint",
        demandOption: true,
      },
      queue: {
        describe: "RabbitMQ queue",
        demandOption: true,
      },
      assertQueueOptions: {
        describe: "RabbitMQ assertQueue options JSON string",
      },
      publishOptions: {
        describe: "RabbitMQ publish options JSON string",
      },
    },
    middlewares: [
      (argv) => ({
        assertQueueOptions: argv.assertQueueOptions
          ? JSON.parse(argv.assertQueueOptions)
          : undefined,
      }),
      (argv) => ({
        publishOptions: argv.publishOptions
          ? JSON.parse(argv.publishOptions)
          : undefined,
      }),
    ],
  },
  {
    name: "tinybird",
    generator: TinybirdGenerator,
    options: {
      endpoint: {
        describe: "API endpoint name",
        choices: ["eu_gcp", "us_gcp", "custom"],
        demandOption: true,
      },
      datasource: {
        describe: "Datasource name",
        demandOption: true,
      },
      token: { describe: "API token", demandOption: true },
    },
    middlewares: [
      (argv) => ({
        endpoint: ["eu_gcp", "us_gcp"].includes(argv.endpoint)
          ? argv.endpoint
          : process.env.TB_ENDPOINT,
      }),
    ],
  },
  {
    name: "upstash-kafka",
    generator: UpstashKafkaGenerator,
    options: {
      address: {
        describe: "Upstash Kafka address",
        demandOption: true,
      },
      user: {
        describe: "Upstash Kafka user",
        demandOption: true,
      },
      pass: {
        describe: "Upstash Kafka password",
        demandOption: true,
      },
      topic: {
        describe: "Upstash Kafka topic",
        demandOption: true,
      },
    },
  },
];
