import { z } from "zod";
import schemaTypes from "./schemaTypes";

export const SCHEMA_KEY_NAMES = [
  "int",
  "uint",
  "float",
  "intString",
  "uintString",
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
  "lat_or_lon_numeric",
  "words",
  "http_method",
  "user_agent",
  "semver",
] as const;

export type SchemaKey = (typeof SCHEMA_KEY_NAMES)[number];

export const schemaSchema = z.record(
  z.object({
    type: z.enum(SCHEMA_KEY_NAMES),
    params: z.any().optional(),
    count: z.number().optional(),
  })
);

export type Schema = z.infer<typeof schemaSchema>;

type SchemaValue<T extends z.ZodRawShape, S> = {
  generator: (params: z.infer<z.ZodObject<T, any, any>>) => S;
  params?: z.ZodObject<T, any, any>;
};

export function createSchemaValue<T extends z.ZodRawShape, S = unknown>(
  generator: (params: z.infer<z.ZodObject<T, any, any>>) => S,
  params?: z.ZodObject<T, any, any>
): SchemaValue<T, ReturnType<typeof generator>> {
  return {
    generator,
    params,
  };
}

export function validateSchema(schema: Schema) {
  const validity = schemaSchema.safeParse(schema) ?? {
    success: true,
  };
  const errors = [];
  if (!validity.success) errors.push(validity.error.message);

  for (const { type, params } of Object.values(schema)) {
    if ("params" in schemaTypes[type as SchemaKey]) {
      const validity = schemaTypes[type as SchemaKey].params?.safeParse(
        params
      ) ?? {
        success: true,
      };

      if (!validity.success) errors.push(validity.error.message);
    }
  }

  return { valid: !errors.length, errors };
}

export const baseConfigSchema = z.object({
  schema: schemaSchema.refine(validateSchema),
  eps: z.number().optional().default(1),
  limit: z.number().optional().default(-1),
  logs: z.boolean().default(false).optional(),
});

export type BaseConfig = z.infer<typeof baseConfigSchema>;

export interface RowGenerator<T> {
  generate: () => T;
}

export interface SchemaGenerator {
  generator: (params: Record<string, unknown>) => unknown | unknown[];
  params: Record<string, unknown>;
  count: number;
}
