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

export const baseConfigSchema = z.object({
  schema: schemaSchema,
  eps: z.number().optional().default(1),
  limit: z.number().optional().default(-1),
  logs: z.boolean().default(false).optional(),
});

export type BaseConfig = z.infer<typeof baseConfigSchema>;

export interface RowGenerator<T> {
  generate: () => T;
}

export interface SchemaGenerator {
  generator: (params: unknown | unknown[]) => unknown | unknown[];
  params: unknown | unknown[];
  count: number;
}
