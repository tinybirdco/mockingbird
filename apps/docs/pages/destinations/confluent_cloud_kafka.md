# Confluent Cloud Kafka

[Confluent Cloud Kafka](https://www.confluent.io/) is cloud-native, complete, and fully managed Kafka service.

## How it works

The Confluent Cloud Kafka destination sends data to using [KAFKA API V3](https://docs.confluent.io/cloud/current/api.html#tag/Records-(v3)/operation/produceRecord).

## Configuration

| Name          |                        Description                         |                                          Example value |
| :------------ | :--------------------------------------------------------: | -----------------------------------------------------: |
| REST endpoint |                        Endpoint URL                        | https://pkc-zpjg0.eu-central-1.aws.confluent.cloud:443 |
| Cluster ID    |                      Kafka cluster ID                      |                                             p0s-f23... |
| Topic         |                        Kafka Topic                         |                                                topic_1 |
| API KEY       |                     Confluent API Key                      |                                              FXVLSF... |
| API Secret    |                    Confluent API Secret                    |                                             GxvPswX... |
| Headers       |                      Optional headers                      |                                                     {} |
| Key           |           Optional key to use for partitioning.            |                                                     {} |
| EPS           | (Events Per Second) How many events per second to generate |                                                   1000 |
| Limit         |       Max number of rows to send (-1 for unlimited)        |                                                     -1 |
