import fetch from "cross-fetch";
import { z } from "zod";
import BaseGenerator from "./BaseGenerator";
import {
  RowGenerator,
  Schema,
  SchemaGenerator,
  baseConfigSchema,
} from "../types";
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
          return count === 1
            ? [{ value: schemaTypes[type].generator(params) }]
            : new Array(count ?? 1)
                .fill(null)
                .map(() => ({ value: schemaTypes[type].generator(params) }));
        },
      };
    }

    return {
      generate() {
        const generatorSchema = Object.entries(schema).reduce(
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
