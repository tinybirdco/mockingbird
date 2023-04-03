import { faker } from "@faker-js/faker";
import { z } from "zod";
import extendedFaker from "./extendedFaker";
import { SchemaKey, SchemaValue } from "./types";

const schemaTypes: Record<SchemaKey, SchemaValue> = {
  int: {
    generator(params) {
      return extendedFaker.datatype.number();
    },
  },
  uint: {
    generator(params) {
      return extendedFaker.datatype.number({ min: 0 });
    },
  },
  float: {
    generator(params) {
      return extendedFaker.datatype.float();
    },
  },
  intString: {
    generator(params) {
      return extendedFaker.datatype.number().toString();
    },
  },
  uintString: {
    generator(params) {
      return extendedFaker.datatype.number({ min: 0 }).toString();
    },
  },
  floatString: {
    generator(params) {
      return extendedFaker.datatype.float().toString();
    },
  },
  hex: {
    generator(params) {
      return extendedFaker.datatype.hexadecimal();
    },
  },
  string: {
    generator(params) {
      return extendedFaker.datatype.string();
    },
  },
  first_name: {
    generator(params) {
      return extendedFaker.name.firstName();
    },
  },
  last_name: {
    generator(params) {
      return extendedFaker.name.lastName();
    },
  },
  full_name: {
    generator(params) {
      return extendedFaker.name.fullName();
    },
  },
  email: {
    generator(params) {
      return extendedFaker.internet.email();
    },
  },
  word: {
    generator(params) {
      return extendedFaker.word.noun();
    },
  },
  domain: {
    generator(params) {
      return extendedFaker.internet.domainName();
    },
  },
  values: {
    params: z.object({
      values: z.array(z.any()),
    }),
    generator(params) {
      return params.values[Math.floor(Math.random() * params.values.length)];
    },
  },
  values_weighted: {
    params: z.object({
      values: z.array(z.any()),
      weights: z.array(z.number()),
    }),
    generator(params) {
      return extendedFaker.helpers.weightedRandom(
        params.values,
        params.weights
      );
    },
  },
  datetime: {
    generator() {
      return faker.date.recent().toISOString().slice(0, 19);
    },
  },
  datetime_range: {
    params: z.object({
      start: z.union([z.string(), z.number(), z.date()]),
      end: z.union([z.string(), z.number(), z.date()]),
    }),
    generator(params) {
      return extendedFaker.date
        .between(params.start, params.end)
        .toISOString()
        .slice(0, 19);
    },
  },
  datetime_lasthour: {
    generator() {
      return faker.date
        .recent(1 / 24)
        .toISOString()
        .slice(0, 19);
    },
  },
  timestamp: {
    generator() {
      return faker.date.recent().toISOString();
    },
  },
  timestamp_now: {
    generator() {
      return new Date().toISOString();
    },
  },
  timestamp_range: {
    params: z.object({
      start: z.union([z.string(), z.number(), z.date()]),
      end: z.union([z.string(), z.number(), z.date()]),
    }),
    generator(params) {
      return extendedFaker.date.between(params.start, params.end).toISOString();
    },
  },
  timestamp_lasthour: {
    generator() {
      return faker.date.recent(1 / 24).toISOString();
    },
  },
  range: {
    params: z.object({
      min: z.number(),
      max: z.number(),
    }),
    generator(params) {
      return extendedFaker.datatype.number({
        min: params.min,
        max: params.max,
      });
    },
  },
  bool: {
    generator(params) {
      return extendedFaker.datatype.boolean();
    },
  },
  uuid: {
    generator(params) {
      return extendedFaker.datatype.uuid();
    },
  },
  browser_name: {
    generator(params) {
      return extendedFaker.browser.browserName();
    },
  },
  browser_engine_name: {
    generator(params) {
      return extendedFaker.browser.browserEngineName();
    },
  },
  city_name: {
    generator(params) {
      return extendedFaker.address.cityName();
    },
  },
  country_code_iso2: {
    generator(params) {
      return extendedFaker.address.countryCode("alpha-2");
    },
  },
  country_code_iso3: {
    generator(params) {
      return extendedFaker.address.countryCode("alpha-3");
    },
  },
  operating_system: {
    generator(params) {
      return extendedFaker.browser.osName();
    },
  },
  search_engine: {
    generator(params) {
      return extendedFaker.browser.searchEngineName();
    },
  },
  lat_or_lon_string: {
    generator(params) {
      return extendedFaker.address.latitude();
    },
  },
  lat_or_lon_numeric: {
    generator(params) {
      return parseFloat(extendedFaker.address.latitude());
    },
  },
  words: {
    params: z.object({
      amount: z.number(),
    }),
    generator(params) {
      return extendedFaker.random.words(params.amount);
    },
  },
  http_method: {
    generator(params) {
      return extendedFaker.internet.httpMethod();
    },
  },
  user_agent: {
    generator(params) {
      return extendedFaker.internet.userAgent();
    },
  },
  semver: {
    generator(params) {
      return extendedFaker.system.semver();
    },
  },
};

export default schemaTypes;
