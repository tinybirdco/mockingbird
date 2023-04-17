import fetch from "cross-fetch";
import { z } from "zod";
import BaseGenerator from "./BaseGenerator";
import {
  baseConfigSchema,
  RowGenerator,
  SchemaGenerator,
  SchemaKey,
} from "../types";
import schemaTypes from "../schemaTypes";

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

  mapType(type: SchemaKey): string {
    switch (type) {
      case "int":
      case "range":
        return "Int32";

      case "uint":
        return "UInt32";

      case "float":
      case "lat_or_lon_numeric":
        return "Float32";

      case "intString":
      case "uintString":
      case "floatString":
      case "hex":
      case "string":
      case "first_name":
      case "last_name":
      case "full_name":
      case "email":
      case "word":
      case "domain":
      case "values":
      case "values_weighted":
      case "browser_name":
      case "browser_engine_name":
      case "city_name":
      case "country_code_iso2":
      case "country_code_iso3":
      case "operating_system":
      case "search_engine":
      case "lat_or_lon_string":
      case "http_method":
      case "user_agent":
      case "semver":
        return "String";

      case "datetime":
      case "datetime_range":
      case "datetime_lasthour":
        return "DateTime";

      case "timestamp":
      case "timestamp_now":
      case "timestamp_range":
      case "timestamp_lasthour":
        return "DateTime64(3)";

      case "bool":
        return "Boolean";

      case "uuid":
        return "UUID";

      case "words":
        return "Array(String)";
      default:
        return "String";
    }
  }

  createRowGenerator(): RowGenerator<TinybirdMessage> {
    return {
      generate: () => {
        const generatorSchema = Object.entries(this.config.schema).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: {
              generator: schemaTypes[value.type].generator,
              params: value.params ?? {},
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

        return generator;
      },
    };
  }

  async sendData(data: TinybirdMessage[]): Promise<void> {
    const params = { name: this.config.datasource };
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
          console.log(`Tinybird response: ${res}`);
        }
      })
      .catch(console.error);
  }
}
