import {
  AblyGenerator,
  AWSSNSGenerator,
  ConfluentCloudKafkaGenerator,
  LogGenerator,
  RabbitMQGenerator,
  TinybirdGenerator,
  UpstashKafkaGenerator,
  AWSKinesisGenerator,
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
    name: "log",
    generator: LogGenerator,
    options: {},
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
        choices: ["eu_gcp", "us_gcp", "gcp_europe_west3", "gcp_us_east4", "aws_eu_central_1", "aws_us_east_1", "aws_us_west_2", "custom"],
        demandOption: true,
      },
      datasource: {
        describe: "Datasource name",
        demandOption: true,
      },
      token: { describe: "API token", demandOption: true },
    },
    middlewares: [
      (argv) => {
        if (argv.endpoint === 'eu_gcp') {
          console.error('eu_gcp is deprecated, use gcp_europe_west3 instead');
          process.exit(1);
        } else if (argv.endpoint === 'us_gcp') {
          console.error('us_gcp is deprecated, use gcp_us_east4 instead');
          process.exit(1);
        } else if (argv.endpoint === 'custom' && !process.env.TB_ENDPOINT) {
          console.error('process.env.TB_ENDPOINT must be set when endpoint is set to "custom"');
          process.exit(1);
        }

        return argv.endpoint === 'custom' ? process.env.TB_ENDPOINT : argv.endpoint;
      },
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
  {
    name: "aws-kinesis",
    generator: AWSKinesisGenerator,
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
      streamName: {
        describe: "AWS Kinesis Stream Name",
        demandOption: true,
      },
      partitionKey: {
        describe: "Partition Key (optional)",
      },
      kinesisOptions: {
        describe: "AWS Kinesis Options JSON string",
      },
    },
    middlewares: [
      (argv) => ({
        kinesisOptions: argv.kinesisOptions ? JSON.parse(argv.kinesisOptions) : undefined,
      }),
    ],
  },
];
