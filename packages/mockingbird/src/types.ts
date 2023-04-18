import _get from "lodash.get";
import { z } from "zod";

import extendedFaker from "./extendedFaker";

type ObjectPath<T extends object, D extends string = ""> = {
  [K in keyof T]: `${D}${Exclude<K, symbol>}${
    | ""
    | (T[K] extends object ? ObjectPath<T[K], "."> : "")}`;
}[keyof T];

type ObjectAtPath<
  T,
  Path extends string
> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? ObjectAtPath<T[Key], Rest>
    : never
  : Path extends keyof T
  ? T[Path]
  : never;

export type FakerFunctions = Omit<
  typeof extendedFaker,
  "helpers" | "locales" | "fake" | "unique" | "mersenne" | "definitions"
>;

export type FakerFunctionParams<T> = T extends (...args: infer P) => any
  ? P
  : never;

export type SchemaKey = Exclude<
  ObjectPath<FakerFunctions>,
  keyof typeof extendedFaker
>;

export type SchemaValue<K extends SchemaKey = SchemaKey> =
  K extends infer Key extends string
    ? {
        type: Key;
        count?: number;
      } & (FakerFunctionParams<ObjectAtPath<FakerFunctions, Key>> extends []
        ? {}
        : { params?: FakerFunctionParams<ObjectAtPath<FakerFunctions, Key>> })
    : never;

export type Schema = Record<string, SchemaValue>;

export function validateSchema(schema: Schema) {
  const errors = [] as string[];

  for (const schemaItem of Object.values(schema)) {
    const { type, count } = schemaItem;

    if (typeof count !== "undefined" && count < 1)
      errors.push(`${type}: Count must be greater than 0`);

    if ("params" in schemaItem) {
      const generator = _get(extendedFaker, type);

      try {
        // @ts-ignore
        // @ts-nocheck
        generator(schemaItem.params);
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

export const schemaSchema = z.record(
  z.object({
    type: z.string(),
    params: z.any().optional(),
    count: z.number().optional(),
  })
);

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
  params: unknown[];
  count: number;
}
