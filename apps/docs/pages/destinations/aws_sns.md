# AWS SNS

[AWS SNS](https://aws.amazon.com/sns/) is a fully managed Pub/Sub service for A2A and A2P messaging

## How it works

The AWS SNS destination sends data to AWS using [official node.js SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/).

## Configuration

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
