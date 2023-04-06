import fetch from "cross-fetch";
import { z } from "zod";
import BaseGenerator from "./BaseGenerator";
import { RowGenerator, SchemaGenerator, baseConfigSchema } from "../types";
import schemaTypes from "../schemaTypes";

const upstashKafkaConfigSchema = baseConfigSchema.merge(
  z.object({
    address: z.string().url(),
    user: z.string(),
    pass: z.string(),
    topic: z.string(),
  })
);

export type UpstashKafkaConfig = z.infer<typeof upstashKafkaConfigSchema>;

export type UpstashKafkaMessage = { value: string }[];

export default class UpstashKafkaGenerator extends BaseGenerator<
  UpstashKafkaConfig,
  UpstashKafkaMessage
> {
  config: UpstashKafkaConfig;

  rowGenerator: RowGenerator<UpstashKafkaMessage>;

  auth: string;

  constructor(config: UpstashKafkaConfig) {
    super();

    this.config = upstashKafkaConfigSchema.parse(config);
    this.rowGenerator = this.createRowGenerator();
    this.auth = Buffer.from(`${this.config.user}:${this.config.pass}`).toString(
      "base64"
    );
  }

  createRowGenerator(): RowGenerator<UpstashKafkaMessage> {
    return {
      generate: () => {
        const generatorSchema = Object.entries(this.config.schema).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: {
              generator: schemaTypes[value.type].generator,
              params: value.params ?? {},
              count: value.count ?? 1,
            },
          }),
          {}
        );

        const generator: Record<string, unknown | unknown[]> = (
          Object.entries(generatorSchema) as [string, SchemaGenerator][]
        ).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]:
              (value.count ?? 1) === 1
                ? value.generator(value.params)
                : new Array(value.count ?? 1)
                    .fill(null)
                    .map(() => value.generator(value.params)),
          };
        }, {});

        return [{ value: JSON.stringify(generator) }];
      },
    };
  }

  async sendData(data: UpstashKafkaMessage[]): Promise<void> {
    return fetch(`${this.config.address}/produce/${this.config.topic}`, {
      headers: { Authorization: `Basic ${this.auth}` },
      method: "POST",
      body: JSON.stringify(data.flat()),
    })
      .then((res) => res.json())
      .then((metadata) => {
        if (metadata.error) {
          throw new Error(metadata.error);
        }

        metadata.forEach((m: { topic: any; partition: any; offset: any }) => {
          console.log(
            `Topic: ${m.topic}, Partition: ${m.partition}, Offset: ${m.offset}`
          );
        });
      })
      .catch(console.error);
  }
}
