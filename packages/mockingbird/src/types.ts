import _get from "lodash.get";
import { z } from "zod";

import extendedFaker from "./extendedFaker";

type ObjectPath<T extends object, D extends string = ""> = {
  [K in keyof T]: `${D}${Exclude<K, symbol>}${
    | ""
    | (T[K] extends object ? ObjectPath<T[K], "."> : "")}`;
}[keyof T];

export type SchemaKey = Exclude<
  ObjectPath<Omit<typeof extendedFaker, "helpers" | "locales" | "fake">>,
  keyof typeof extendedFaker
>;

export const schemaSchema = z.record(
  z.object({
    type: z.string(),
    params: z.any().optional(),
    count: z.number().optional(),
  })
);

export type Schema = Record<
  string,
  {
    type: SchemaKey;
    params?: unknown;
    count?: number;
  }
>;

export function validateSchema(schema: Schema) {
  const errors = [] as string[];

  for (const { type, params, count } of Object.values(schema)) {
    if (typeof count !== "undefined" && count < 1)
      errors.push(`${type}: Count must be greater than 0`);

    if (params) {
      const generator = _get(extendedFaker, type);

      try {
        generator(params);
      } catch (e) {
        errors.push(
          `${type}: ${
            e && typeof e === "object" && "toString" in e
              ? e.toString()
              : "Unknown error"
          }`
        );
      }
    }
  }

  return { valid: !errors.length, errors };
}

export const baseConfigSchema = z.object({
  schema: schemaSchema.refine((schemaSchema) =>
    validateSchema(schemaSchema as Schema)
  ),
  eps: z.number().optional().default(1),
  limit: z.number().optional().default(-1),
  logs: z.boolean().default(false).optional(),
});

export type BaseConfig = z.infer<typeof baseConfigSchema>;

export interface RowGenerator<T> {
  generate: () => T;
}

export interface SchemaGenerator {
  generator: (...params: unknown[]) => unknown | unknown[];
  params: unknown | unknown[];
  count: number;
}
