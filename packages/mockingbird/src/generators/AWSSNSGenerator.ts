import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { z } from "zod";

import { Row } from "../types";
import { BaseGenerator, baseConfigSchema } from "./BaseGenerator";

const awsSNSConfigSchema = baseConfigSchema.merge(
  z.object({
    region: z.string(),
    accessKeyId: z.string(),
    secretAccessKey: z.string(),
    topicArn: z.string(),
    subject: z.string().optional(),
    snsOptions: z.any().optional(),
  })
);

export type AWSSNSConfig = z.infer<typeof awsSNSConfigSchema>;

export class AWSSNSGenerator extends BaseGenerator<AWSSNSConfig> {
  readonly client: SNSClient;

  constructor(config: AWSSNSConfig) {
    super(awsSNSConfigSchema.parse(config));

    this.client = new SNSClient({
      ...this.config.snsOptions,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  async sendData(rows: Row[]): Promise<void> {
    await Promise.all(
      rows.map((row) =>
        this.client
          .send(
            new PublishCommand({
              Message: JSON.stringify(row),
              Subject: this.config.subject,
              TopicArn: this.config.topicArn,
            })
          )
          .then((data) => {
            this.log("info", `AWS SNS Response: ${JSON.stringify(data)}`);
          })
          .catch((err) => {
            this.log("error", `AWS SNS Error: ${JSON.stringify(err)}`);
          })
      )
    );
  }
}
