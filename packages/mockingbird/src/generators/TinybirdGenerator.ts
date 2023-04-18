import fetch from "cross-fetch";
import _get from "lodash.get";
import { z } from "zod";

import extendedFaker from "../extendedFaker";
import { baseConfigSchema, RowGenerator, SchemaGenerator } from "../types";
import BaseGenerator from "./BaseGenerator";

const tinybirdConfigSchema = baseConfigSchema.merge(
  z.object({
    endpoint: z.string(),
    datasource: z.string(),
    token: z.string(),
  })
);

export type TinybirdConfig = z.infer<typeof tinybirdConfigSchema>;

export type TinybirdMessage = Record<string, unknown>;

export default class TinybirdGenerator extends BaseGenerator<
  TinybirdConfig,
  TinybirdMessage
> {
  config: TinybirdConfig;

  rowGenerator: RowGenerator<TinybirdMessage>;

  endpoints = {
    eu_gcp: "https://api.tinybird.co",
    us_gcp: "https://api.us-east.tinybird.co",
  } as const;

  events_path = "/v0/events" as const;

  constructor(config: TinybirdConfig) {
    super();

    this.config = tinybirdConfigSchema.parse(config);
    this.rowGenerator = this.createRowGenerator();
  }

  createRowGenerator(): RowGenerator<TinybirdMessage> {
    return {
      generate: () => {
        const generatorSchema = Object.entries(this.config.schema).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: {
              generator: _get(extendedFaker, value.type),
              params: value.params,
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
                ? value.generator(...value.params)
                : new Array(value.count ?? 1)
                    .fill(null)
                    .map(() => value.generator(...value.params)),
          };
        }, {});

        return generator;
      },
    };
  }

  async sendData(data: TinybirdMessage[]): Promise<void> {
    const params = { name: this.config.datasource, from: "mockingbird" };
    const endpointURL =
      this.config.endpoint in this.endpoints
        ? this.endpoints[this.config.endpoint as keyof typeof this.endpoints]
        : this.config.endpoint;
    const url = new URL(`${endpointURL}${this.events_path}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${this.config.token}`,
      },
      method: "POST",
      body: data.map((d) => JSON.stringify(d)).join("\n"),
    })
      .then((res) => {
        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.toLowerCase().indexOf("text") > -1) {
          return res.text();
        }
        return res.json();
      })
      .then((res) => {
        if (this.config.logs) {
          console.log(`Tinybird response: ${JSON.stringify(res)}`);
        }
      })
      .catch(console.error);
  }
}
