import { faker } from "@faker-js/faker";
import { z } from "zod";
import extendedFaker from "./extendedFaker";
import { createSchemaValue } from "./types";

const schemaTypes = {
  ...Object.values(extendedFaker)
    .map((v) => Object.values(v))
    .flat()
    .reduce(
      (acc, f) =>
        typeof f === "function"
          ? {
              ...acc,
              [f.name.replace("bound ", "faker-")]: createSchemaValue(
                (params) => f(...Object.values(params))
              ),
            }
          : acc,
      {}
    ),
  int: createSchemaValue(() => extendedFaker.datatype.number()),
  uint: createSchemaValue(() => extendedFaker.datatype.number({ min: 0 })),
  float: createSchemaValue(() => extendedFaker.datatype.float()),
  intString: createSchemaValue(() =>
    extendedFaker.datatype.number().toString()
  ),
  uintString: createSchemaValue(() =>
    extendedFaker.datatype.number({ min: 0 }).toString()
  ),
  floatString: createSchemaValue(() =>
    extendedFaker.datatype.float().toString()
  ),
  hex: createSchemaValue(() => extendedFaker.datatype.hexadecimal()),
  string: createSchemaValue(() => extendedFaker.datatype.string()),
  first_name: createSchemaValue(() => extendedFaker.name.firstName()),
  last_name: createSchemaValue(() => extendedFaker.name.lastName()),
  full_name: createSchemaValue(() => extendedFaker.name.fullName()),
  email: createSchemaValue(() => extendedFaker.internet.email()),
  word: createSchemaValue(() => extendedFaker.word.noun()),
  domain: createSchemaValue(() => extendedFaker.internet.domainName()),
  values: createSchemaValue(
    (params) => params.values[Math.floor(Math.random() * params.values.length)],
    z.object({ values: z.array(z.any()) })
  ),
  values_weighted: createSchemaValue(
    (params) =>
      extendedFaker.helpers.weightedRandom(params.values, params.weights),
    z.object({
      values: z.array(z.any()),
      weights: z.array(z.number()),
    })
  ),
  datetime: createSchemaValue(() =>
    faker.date.recent().toISOString().slice(0, 19)
  ),
  datetime_range: createSchemaValue(
    (params) =>
      extendedFaker.date
        .between(params.start, params.end)
        .toISOString()
        .slice(0, 19),
    z.object({
      start: z.union([z.string(), z.number(), z.date()]),
      end: z.union([z.string(), z.number(), z.date()]),
    })
  ),
  datetime_lasthour: createSchemaValue(() =>
    faker.date
      .recent(1 / 24)
      .toISOString()
      .slice(0, 19)
  ),
  timestamp: createSchemaValue(() => faker.date.recent().toISOString()),
  timestamp_now: createSchemaValue(() => new Date().toISOString()),
  timestamp_range: createSchemaValue(
    (params) =>
      extendedFaker.date.between(params.start, params.end).toISOString(),
    z.object({
      start: z.union([z.string(), z.number(), z.date()]),
      end: z.union([z.string(), z.number(), z.date()]),
    })
  ),
  timestamp_lasthour: createSchemaValue(() =>
    faker.date.recent(1 / 24).toISOString()
  ),
  range: createSchemaValue(
    (params) =>
      extendedFaker.datatype.number({
        min: params.min,
        max: params.max,
      }),
    z.object({
      min: z.number(),
      max: z.number(),
    })
  ),
  bool: createSchemaValue(() => extendedFaker.datatype.boolean()),
  uuid: createSchemaValue(() => extendedFaker.datatype.uuid()),
  browser_name: createSchemaValue(() => extendedFaker.browser.browserName()),
  browser_engine_name: createSchemaValue(() =>
    extendedFaker.browser.browserEngineName()
  ),
  city_name: createSchemaValue(() => extendedFaker.address.cityName()),
  country_code_iso2: createSchemaValue(() =>
    extendedFaker.address.countryCode("alpha-2")
  ),
  country_code_iso3: createSchemaValue(() =>
    extendedFaker.address.countryCode("alpha-3")
  ),
  operating_system: createSchemaValue(() => extendedFaker.browser.osName()),
  search_engine: createSchemaValue(() =>
    extendedFaker.browser.searchEngineName()
  ),
  lat_or_lon_string: createSchemaValue(() => extendedFaker.address.latitude()),
  lat_or_lon_numeric: createSchemaValue(() =>
    parseFloat(extendedFaker.address.latitude())
  ),
  words: createSchemaValue(
    (params) => extendedFaker.random.words(params.amount),
    z.object({
      amount: z.number(),
    })
  ),
  http_method: createSchemaValue(() => extendedFaker.internet.httpMethod()),
  user_agent: createSchemaValue(() => extendedFaker.internet.userAgent()),
  semver: createSchemaValue(() => extendedFaker.system.semver()),
} as const;

export default schemaTypes;
