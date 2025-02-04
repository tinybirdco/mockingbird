import {
  KinesisClient,
  PutRecordsCommand,
  PutRecordsCommandInput,
  PutRecordsRequestEntry,
} from "@aws-sdk/client-kinesis";
import { z } from "zod";

import { Row } from "../types";
import { BaseGenerator, baseConfigSchema } from "./BaseGenerator";

const awsKinesisConfigSchema = baseConfigSchema.merge(
  z.object({
    region: z.string(),
    accessKeyId: z.string(),
    secretAccessKey: z.string(),
    streamName: z.string(),
    partitionKey: z.string().optional(),
    kinesisOptions: z.any().optional(),
  })
);

export type AWSKinesisConfig = z.infer<typeof awsKinesisConfigSchema>;

export class AWSKinesisGenerator extends BaseGenerator<AWSKinesisConfig> {
  readonly client: KinesisClient;

  constructor(config: AWSKinesisConfig) {
    super(awsKinesisConfigSchema.parse(config));

    this.client = new KinesisClient({
      ...this.config.kinesisOptions,
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  async sendData(rows: Row[]): Promise<void> {
    const records: PutRecordsRequestEntry[] = rows.map((row) => ({
      Data: new Uint8Array(Buffer.from(JSON.stringify(row))),
      PartitionKey:
        this.config.partitionKey || Math.random().toString(36).substring(2, 15),
    }));
    const command = new PutRecordsCommand({
      StreamName: this.config.streamName,
      Records: records,
    } as PutRecordsCommandInput);

    try {
      const response = await this.client.send(command);
      this.log("info", `AWS Kinesis Response: ${JSON.stringify(response)}`);
    } catch (err) {
      this.log("error", `AWS Kinesis Error: ${JSON.stringify(err)}`);
    }
  }
}
