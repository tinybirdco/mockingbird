import _get from "lodash.get";

import extendedFaker from "./extendedFaker";

/**
 * @description Generates all possible paths of an object
 * @example extendedFaker -> "mockingbird.latitudeNumeric" | ...
 */
type ObjectPath<T extends object, D extends string = ""> = {
  [K in keyof T]: `${D}${Exclude<K, symbol>}${
    | ""
    | (T[K] extends object ? ObjectPath<T[K], "."> : "")}`;
}[keyof T];

/**
 * @description Gets the type of value at certain path of an object
 * @example "mockingbird.latitudeNumeric" => () => number
 */
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

/**
 * @description All actual faker functions, excluding utils
 */
export type FakerFunctions = Omit<
  typeof extendedFaker,
  "helpers" | "locales" | "definitions"
>;

/**
 * @description Returns an array of parameters of a function
 * () => number => []
 */
export type FakerFunctionParams<T> = T extends (...args: infer P) => any
  ? P extends [...args: infer P, options: { state: Record<string, unknown> }]
    ? P
    : P
  : never;

/**
 * @description All possible paths (functions) of extendedFaker
 */
export type SchemaKey = Exclude<
  ObjectPath<FakerFunctions>,
  keyof typeof extendedFaker
>;

/**
 * @description All possible paths (functions) of extendedFaker that take parameters
 */
export type ParameterizedSchemaKey<K extends SchemaKey = SchemaKey> =
  K extends SchemaKey
    ? FakerFunctionParams<ObjectAtPath<FakerFunctions, K>> extends []
      ? never
      : K
    : never;

/**
 * @description All possible paths (functions) of extendedFaker that do not take parameters
 */
export type UnparameterizedSchemaKey = Exclude<
  SchemaKey,
  ParameterizedSchemaKey
>;

/**
 * @description All possible values of a schema,
 * if the key is does not take any parameters it gets reduced to UnparameterizedSchemaKey,
 * else it will return the actual key and the parameters
 */
export type SchemaValue<K extends SchemaKey = SchemaKey> =
  K extends UnparameterizedSchemaKey
    ? {
        type: UnparameterizedSchemaKey;
        count?: number;
      }
    : {
        type: K;
        count?: number;
        params?: FakerFunctionParams<ObjectAtPath<FakerFunctions, K>>;
      };

/**
 * @description The schema object
 */
export type Schema = Record<string, SchemaValue>;

export const PRESET_SCHEMA_NAMES = [
  "Simple Example",
  "eCommerce Transactions",
  "Stock Prices",
  "Flight Bookings",
  "Content Tracking",
  "Web Analytics Starter Kit",
  "Log Analytics Starter Kit",
] as const;
export type PresetSchemaName = (typeof PRESET_SCHEMA_NAMES)[number];

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
        generator(...schemaItem.params);
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

export type Row = Record<string, unknown | unknown[]>;
