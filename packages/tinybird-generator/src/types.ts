import { z } from "zod";

const ALL_SCHEMA_TYPES = [
  "int",
  "intString",
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
  "timestamp",
  "timestamp_range",
  "function",
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

export type TinybirdSchemaType = typeof ALL_SCHEMA_TYPES[number];

export type TinybirdSchema = Record<
  string,
  { type: TinybirdSchemaType; params: z.AnyZodObject }
>;

export interface TinybirdDataType {
  tinybird_type: string;
  params?: z.AnyZodObject;
  generator: (params: Record<string, any>) => unknown;
}

export interface TinybirdRowGenerator {
  generate: () => Record<string, unknown>;
}
