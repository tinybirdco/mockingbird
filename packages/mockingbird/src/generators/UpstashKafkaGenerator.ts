import fetch from "cross-fetch";
import { z } from "zod";

import { Row, baseConfigSchema } from "../types";
import BaseGenerator from "./BaseGenerator";

const upstashKafkaConfigSchema = baseConfigSchema.merge(
  z.object({
    address: z.string().url(),
    user: z.string(),
    pass: z.string(),
    topic: z.string(),
  })
);

export type UpstashKafkaConfig = z.infer<typeof upstashKafkaConfigSchema>;

export default class UpstashKafkaGenerator extends BaseGenerator<UpstashKafkaConfig> {
  readonly config: UpstashKafkaConfig;

  readonly auth: string;

  constructor(config: UpstashKafkaConfig) {
    super();

    this.config = upstashKafkaConfigSchema.parse(config);
    this.auth = Buffer.from(`${this.config.user}:${this.config.pass}`).toString(
      "base64"
    );
  }

  async sendData(rows: Row[]): Promise<void> {
    const url = new URL(`${this.config.address}/produce/${this.config.topic}`);

    await Promise.all(
      rows.map((row) =>
        fetch(url, {
          headers: { Authorization: `Basic ${this.auth}` },
          method: "POST",
          body: JSON.stringify({ value: JSON.stringify(row) }),
        })
          .then((res) => res.json())
          .then((metadata) => {
            if (metadata.error) {
              throw new Error(metadata.error);
            }

            this.log("info", `Upstash Response: ${JSON.stringify(metadata)}`);
          })
          .catch((err) => {
            this.log("error", `Upstash Error: ${JSON.stringify(err)}`);
          })
      )
    );
  }
}
