# Tinybird

[Tinybird](https://www.tinybird.co/) is a real-time data platform. 

Tinybird developers and data teams to harness the power of real-time data and quickly build data pipelines and data products. With Tinybird, you can ingest multiple data sources at scale, query and shape them using the 100% pure SQL you already know and love, and publish the results as low-latency, high-concurrency APIs you consume in your applications. Developers can create fast APIs, faster. What used to take hours and days now only takes minutes.

## How it works

The Tinybird destination sends data to Tinybird via the [Tinybird Events API](https://www.tinybird.co/docs/ingest/events-api.html). Data is sent as new-line delimited JSON (NJDSON), contained in the body of a POST request.

## Configuration

| Name   | Description | Example value |
| :----- | :----: | ----: |
| Data Source | The name of the Tinybird Data Source to send data to | my_data_source |
| Auth Token | The Auth Token with WRITE permissions on the configured Data Source  |  p.ePjdfbsdjnfeunf... |
| Region | The Tinybird Region of the configured Data Source  |  EU |
| EPS | (Events Per Second) How many events per second to generate  |  1000 |
