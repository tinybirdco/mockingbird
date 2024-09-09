# AWS Kinesis

[AWS Kinesis](https://aws.amazon.com/kinesis/) is a fully managed, scalable, and real-time data streaming service. It can continuously capture gigabytes of data per second from hundreds of thousands of sources, making it ideal for real-time analytics, application logs, and IoT device data.

## How it works

The AWS Kinesis destination sends data to AWS using [official node.js SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-kinesis/).

## Configuration

| Name              |                                 Description                                  |             Example value |
| :---------------- | :--------------------------------------------------------------------------: | ------------------------: |
| Region            |                                  AWS region                                  |                 us-east-1 |
| Access Key ID     |                               AWS credentials                                |               accessKeyId |
| Secret Access Key |                               AWS credentials                                |           secretAccessKey |
| streamName        |                       The name of the stream you want to publish to          |            my-stream-name |
| partitionKey      |               Partition key to use for the data. Random by default.          |                        "" |
| kinesisOptions    |                  Any additional options passed to KinesisClient              |                        {} |
| EPS               |          (Events Per Second) How many events per second to generate          |                      1000 |
| Limit             |                Max number of rows to send (-1 for unlimited)                 |                        -1 |
