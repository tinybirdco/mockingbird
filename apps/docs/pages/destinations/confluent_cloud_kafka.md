# Confluent Cloud Kafka

[Confluent Cloud Kafka](https://www.confluent.io/) is a cloud-native, fully managed Kafka service.

## Support

| Web | CLI |
| :-: | :-: |
| No | Yes |

## How it works

The Confluent Cloud Kafka destination sends data using the [Confluent Kafka Records API (v3)](https://docs.confluent.io/cloud/current/api.html#tag/Records-(v3)/operation/produceRecord).

## Configuration

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
