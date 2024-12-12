# RabbitMQ

RabbitMQ is a popular open source message broker.

## Support

| Web | CLI |
| :-: | :-: |
| No  | Yes |

## How it works

The RabbitMQ destination sends data using [amqplib](https://www.npmjs.com/package/amqplib). 

## Configuration

| Name              |                                 Description                                  |             Example value |
| :---------------- | :--------------------------------------------------------------------------: | ------------------------: |
| Endpoint          |                                  RabbitMQ endpoint                           |          amqp://localhost |
| Queue             |                                  RabbitMQ queue                              |                my-queue   |
| AssertQueueOptions|                  RabbitMQ assertQueue options JSON string                    | {"expires": 60000}        |
| PublishOptions    |                  RabbitMQ publish options JSON string                        | {"persistent": true}      |
