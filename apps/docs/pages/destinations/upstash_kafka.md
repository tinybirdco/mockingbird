# Upstash Kafka

Upstash Kafka is a true Serverless Kafka where price scales to zero. With per-request-pricing you only pay what you use. Built-in REST API allows you to produce and consume your Kafka topics from anywhere.

## How it works

The Upstash Kafka destination sends data encoded in JSON using the [REST Producer API](https://docs.upstash.com/kafka/restproducer).

## Configuration

| Name     |                         Description                         |        Example value |
| :------- | :---------------------------------------------------------: | -------------------: |
| Topic    |         The name of the Kafka Topic to send data to         |             my_topic |
| User     | The username with WRITE permissions on the configured topic | fghtdgfvdjndfg794tjf |
| Password |             The password of the configured user             |  jkfngkjng389430thdf |
| EPS      | (Events Per Second) How many events per second to generate  |                 1000 |
| Limit    |        Max number of rows to send (-1 for unlimited)        |                   -1 |
