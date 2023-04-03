import fetch from "cross-fetch";
import { z } from "zod";
import BaseGenerator from "./BaseGenerator";
import { RowGenerator, Schema, baseConfigSchema } from "../types";
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

  auth: string;

  constructor(config: UpstashKafkaConfig) {
    config = upstashKafkaConfigSchema.parse(config);
    super(config);
    this.config = config;
    this.auth = Buffer.from(`${this.config.user}:${this.config.pass}`).toString(
      "base64"
    );
  }

  createRowGenerator(schema: Schema): RowGenerator<UpstashKafkaMessage> {
    const values = Object.values(schema);

    if (values.length === 1) {
      const { type, params, count } = values[0];

      return {
        generate() {
          return new Array(count ?? 1)
            .fill(null)
            .map(() =>
              schemaTypes[type].generator(params)
            ) as UpstashKafkaMessage;
        },
      };
    }

    return {
      generate() {
        return [{ value: "NYC" }];
      },
    };

    // TODO: implement this with count & add to TinybirdGenerator

    /*    const generatorSchema = Object.entries(schema).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          generator: schemaTypes[value.type].generator,
          params: value.params ?? {},
        },
      }),
      {}
    );

    return {
      generate() {
        return {
          value: JSON.stringify(
            Object.entries(generatorSchema).reduce((acc, [key, value]) => {
              const v = value as { generator: Function; params: unknown[] };

              return {
                ...acc,
                [key]: v.generator(v.params),
              };
            }, {})
          ),
        };
      },
    }; */
  }

  async sendData(data: UpstashKafkaMessage[]): Promise<void> {
    return fetch(`${this.config.address}/produce/${this.config.topic}`, {
      headers: { Authorization: `Basic ${this.auth}` },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((metadata) => {
        metadata.forEach((m: { topic: any; partition: any; offset: any }) => {
          console.log(
            `Topic: ${m.topic}, Partition: ${m.partition}, Offset: ${m.offset}`
          );
        });
      })
      .catch(console.error);
  }
}
