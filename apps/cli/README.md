# CLI for @tinybirdco/mockingbird

## Installing

```bash
$ npm install -g @tinybirdco/mockingbird-cli
```

## Usage

### Commands

Use `mockingbird-cli --help` to get a list of available commands or

Use `mockingbird-cli <command> --help` to get a list of available options for a command.

```bash
@tinybirdco/mockingbird-cli  ably
@tinybirdco/mockingbird-cli  aws-sns
@tinybirdco/mockingbird-cli  confluent-cloud-kafka
@tinybirdco/mockingbird-cli  rabbitmq
@tinybirdco/mockingbird-cli  tinybird
@tinybirdco/mockingbird-cli  upstash-kafka
@tinybirdco/mockingbird-cli  aws-kinesis
```

### Common options

```bash
--template   Template to use for populating
  [choices: "Simple Example", "eCommerce Transactions", "Stock Prices", "Flight
    Bookings", "Content Tracking", "Web Analytics Starter Kit", "Log Analytics
                                      Starter Kit"] [default: "Simple Example"]
--schema     Path to schema file
--eps        Events per second                                    [default: 1]
--limit      Max number of rows to send (-1 for unlimited)       [default: -1]
--logs       Enable logs                                       [default: true]
```

### Ably

```bash
--apiKey     Ably API Key                                           [required]
--channelId  Ably Channel ID                                        [required]
```

### AWS SNS

```bash
--region           AWS Region                                       [required]
--accessKeyId      AWS Access Key ID                                [required]
--secretAccessKey  AWS Secret Access Key                            [required]
--topicArn         AWS SNS Topic ARN                                [required]
--subject          AWS SNS Subject
--snsOptions       AWS SNS Options JSON string
```

### Confluent Cloud Kafka

```bash
--restEndpoint  Confluent Cloud Kafka REST endpoint                 [required]
--clusterId     Confluent Cloud Kafka cluster ID                    [required]
--topic         Confluent Cloud Kafka topic                         [required]
--apiKey        Confluent Cloud Kafka API Key                       [required]
--apiSecret     Confluent Cloud Kafka API Secret                    [required]
--headers       Confluent Cloud Kafka headers JSON string
--key           Confluent Cloud Kafka key JSON string
```

### RabbitMQ

```bash
--endpoint            RabbitMQ endpoint                              [required]
--queue               RabbitMQ queue                                 [required]
--assertQueueOptions  RabbitMQ assertQueue options JSON string
--publishOptions      RabbitMQ publish options JSON string
```

### Tinybird

```bash
--endpoint    API endpoint name
                            [required] [choices: "gcp_europe_west3", "gcp_us_east4", "aws_eu_central_1", "aws_us_east_1", "aws_us_west_2", "custom"]
--datasource  Datasource name                                       [required]
--token       API token                                             [required]
```

### Upstash Kafka

```bash
--address   Upstash Kafka address                                   [required]
--user      Upstash Kafka user                                      [required]
--pass      Upstash Kafka password                                  [required]
--topic     Upstash Kafka topic                                     [required]
```
