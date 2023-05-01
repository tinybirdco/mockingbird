import fetch from "cross-fetch";
import { z } from "zod";

import { baseConfigSchema, Row } from "../types";
import BaseGenerator from "./BaseGenerator";

const ablyConfigSchema = baseConfigSchema.merge(
  z.object({
    apiKey: z.string(),
    channelId: z.string(),
  })
);

export type AblyConfig = z.infer<typeof ablyConfigSchema>;

export default class AblyGenerator extends BaseGenerator<AblyConfig> {
  readonly config: AblyConfig;

  readonly token: string;

  constructor(config: AblyConfig) {
    super();

    this.config = ablyConfigSchema.parse(config);
    this.token = Buffer.from(this.config.apiKey).toString("base64");
  }

  async sendData(rows: Row[]): Promise<void> {
    const url = new URL(
      `https://rest.ably.io/channels/${this.config.channelId}/messages`
    );

    await fetch(url, {
      headers: {
        Authorization: `Basic ${this.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        name: "publish",
        data: rows,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (this.config.logs) {
          this.log("info", `Ably Response: ${JSON.stringify(res)}`);
        }
      })
      .catch((err) => {
        this.log("error", `Ably Error: ${JSON.stringify(err)}`);
      });
  }
}
