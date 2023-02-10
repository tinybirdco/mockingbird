import { z } from "zod";
import presetSchemas from "./presetSchemas";
import validateSchema from "./validateSchema";

export const ALL_TINYBIRD_ENDPOINTS = ["eu_gcp", "us_gcp"];

export type TinybirdEndpointType = (typeof ALL_TINYBIRD_ENDPOINTS)[number];

export const ALL_SCHEMA_TYPES = [
  "int",
  "intString",
  "float",
  "floatString",
  "hex",
  "string",
  "first_name",
  "last_name",
  "full_name",
  "email",
  "word",
  "domain",
  "values",
  "values_weighted",
  "datetime",
  "datetime_range",
  "datetime_lasthour",
  "timestamp",
  "timestamp_now",
  "timestamp_range",
  "timestamp_lasthour",
  "range",
  "bool",
  "uuid",
  "browser_name",
  "browser_engine_name",
  "city_name",
  "country_code_iso2",
  "country_code_iso3",
  "operating_system",
  "search_engine",
  "lat_or_lon_string",
  "lat_or_lon_int",
  "words",
  "http_method",
  "user_agent",
  "semver",
] as const;

export type TinybirdSchemaType = (typeof ALL_SCHEMA_TYPES)[number];

export const schemaSchema = z.record(
  z.object({
    type: z.string().refine((t) => [...ALL_SCHEMA_TYPES].includes(t as any)),
    params: z.any(),
  })
);

export const configSchema = z.object({
  schema: schemaSchema
    .optional()
    .default(presetSchemas["Web Analytics Starter Kit"])
    .refine(validateSchema),
  endpoint: z.string(),
  datasource: z.string(),
  token: z.string(),
  eps: z.number().optional().default(1),
  limit: z.number().optional().default(-1),
});

export type TinybirdConfig = z.infer<typeof configSchema>;

export type TinybirdSchema = z.infer<typeof schemaSchema>;

export interface TinybirdDataType {
  tinybird_type: string;
  params?: z.AnyZodObject;
  generator: (params: Record<string, any>) => unknown;
}

export interface TinybirdRowGenerator {
  generate: () => Record<string, unknown>;
}
