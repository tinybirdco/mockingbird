# Google Spanner

[Google Spanner](https://cloud.google.com/spanner) is a relational, key-value, graph, and vector database. It is a highly scalable database that combines unlimited scalability with relational semantics, such as secondary indexes, strong consistency, schemas, and SQL providing 99.999% availability in one easy solution.

## How it works

The Google Spanner destination sends data to Spanner using [official node.js SDK](https://github.com/googleapis/nodejs-spanner).

## Configuration

| Name              |                                 Description                                  |             Example value |
| :---------------- | :--------------------------------------------------------------------------: | ------------------------: |
| projectId         |                                  GCP Project ID                              |            myfirstproject |
| instanceId        |                               Spanner Instance ID                            |                myinstance |
| databaseId        |                               Spanner Database ID                            |                mydatabase |
| table             |                               Spanner Table Name                             |                   mytable |
| keyFilename       |                       Path to GCP Service Account Key JSON file              |          ../my.creds.json |