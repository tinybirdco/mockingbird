# Ably

[Ably](https://ably.com/) reliably distributes realtime data to your users using the publish/subscribe messaging pattern over WebSocket connections.

## How it works

The Ably destination sends data to Ably via the [Ably REST API](https://ably.com/docs/api/rest-api#publish).

## Configuration

| Name       |                        Description                         | Example value |
| :--------- | :--------------------------------------------------------: | ------------: |
| API Key    |           Ably API key for basic authentication            |     xVLyHw... |
| Channel ID |      The ID of the channel to which the data is send       |  rest-example |
| EPS        | (Events Per Second) How many events per second to generate |          1000 |
| Limit      |       Max number of rows to send (-1 for unlimited)        |            -1 |
