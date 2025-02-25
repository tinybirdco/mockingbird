import fetch from "cross-fetch";
import { z } from "zod";

import { Row } from "../types";
import { BaseGenerator, baseConfigSchema } from "./BaseGenerator";

const confluentCloudKafkaConfigSchema = baseConfigSchema.merge(
  z.object({
    restEndpoint: z.string().url(),
    clusterId: z.string(),
    topic: z.string(),
    apiKey: z.string(),
    apiSecret: z.string(),
    headers: z.array(z.record(z.string())).optional(),
    key: z
      .object({
        type: z.literal("BINARY"),
        data: z.string(),
      })
      .or(
        z.object({
          type: z.literal("JSON"),
          data: z.record(z.string()),
        })
      )
      .optional(),
  })
);

export type ConfluentCloudKafkaConfig = z.infer<
  typeof confluentCloudKafkaConfigSchema
>;

export class ConfluentCloudKafkaGenerator extends BaseGenerator<ConfluentCloudKafkaConfig> {
  readonly token: string;

  constructor(config: ConfluentCloudKafkaConfig) {
    super(confluentCloudKafkaConfigSchema.parse(config));

    this.token = Buffer.from(
      `${this.config.apiKey}:${this.config.apiSecret}`
    ).toString("base64");
  }

  async sendData(rows: Row[]): Promise<void> {
    const url = `${this.config.restEndpoint}/kafka/v3/clusters/${this.config.clusterId}/topics/${this.config.topic}/records`;

    await Promise.all(
      rows.map((row) =>
        fetch(url, {
          headers: {
            Authorization: `Basic ${this.token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            headers: this.config.headers,
            timestamp: new Date().toISOString(),
            key: this.config.key,
            value: {
              type: "JSON",
              data: row,
            },
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.error_code !== 200) {
              throw new Error(res);
            }

            if (this.config.logs) {
              this.log(
                "info",
                `Confluent Kafka Response: ${JSON.stringify(res)}`
              );
            }
          })
          .catch((err) => {
            this.log("error", `Confluent Kafka Error: ${JSON.stringify(err)}`);
          })
      )
    );
  }
}
