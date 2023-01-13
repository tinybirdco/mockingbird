import { faker } from "@faker-js/faker";
import { z } from "zod";
import extendedFaker from "./extendedFaker";
import { TinybirdDataType, TinybirdSchemaType } from "./types";

const dataTypes: Record<TinybirdSchemaType, TinybirdDataType> = {
  int: {
    tinybird_type: "int",
    generator(params) {
      return extendedFaker.datatype.number();
    },
  },
  intString: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.datatype.number().toString();
    },
  },
  float: {
    tinybird_type: "float",
    generator(params) {
      return extendedFaker.datatype.float();
    },
  },
  floatString: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.datatype.float().toString();
    },
  },
  hex: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.datatype.hexadecimal();
    },
  },
  string: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.datatype.string();
    },
  },
  first_name: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.name.firstName();
    },
  },
  last_name: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.name.lastName();
    },
  },
  full_name: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.name.fullName();
    },
  },
  email: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.internet.email();
    },
  },
  word: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.word.noun();
    },
  },
  domain: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.internet.domainName();
    },
  },
  values: {
    tinybird_type: "string",
    params: z.object({
      values: z.array(z.any()),
    }),
    generator(params) {
      return params.values[Math.floor(Math.random() * params.values.length)];
    },
  },
  values_weighted: {
    tinybird_type: "string",
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
    tinybird_type: "DateTime",
    generator() {
      return faker.date.recent().toISOString().slice(0, 19);
    },
  },
  datetime_range: {
    tinybird_type: "datetime",
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
  timestamp: {
    tinybird_type: "DateTime64(3)",
    generator() {
      return faker.date.recent().toISOString();
    },
  },
  timestamp_range: {
    tinybird_type: "DateTime64(3)",
    params: z.object({
      start: z.union([z.string(), z.number(), z.date()]),
      end: z.union([z.string(), z.number(), z.date()]),
    }),
    generator(params) {
      return extendedFaker.date.between(params.start, params.end).toISOString();
    },
  },
  range: {
    tinybird_type: "int",
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
    tinybird_type: "Bool",
    generator(params) {
      return extendedFaker.datatype.boolean();
    },
  },
  uuid: {
    tinybird_type: "UUID",
    generator(params) {
      return extendedFaker.datatype.uuid();
    },
  },
  browser_name: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.browser.browserName();
    },
  },
  browser_engine_name: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.browser.browserEngineName();
    },
  },
  city_name: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.address.cityName();
    },
  },
  country_code_iso2: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.address.countryCode("alpha-2");
    },
  },
  country_code_iso3: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.address.countryCode("alpha-3");
    },
  },
  operating_system: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.browser.osName();
    },
  },
  search_engine: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.browser.searchEngineName();
    },
  },
  lat_or_lon_string: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.address.latitude().toString();
    },
  },
  lat_or_lon_int: {
    tinybird_type: "int",
    generator(params) {
      return extendedFaker.address.latitude();
    },
  },
  words: {
    tinybird_type: "string",
    params: z.object({
      amount: z.number(),
    }),
    generator(params) {
      return extendedFaker.random.words(params.amount);
    },
  },
  http_method: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.internet.httpMethod();
    },
  },
  user_agent: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.internet.userAgent();
    },
  },
  semver: {
    tinybird_type: "string",
    generator(params) {
      return extendedFaker.system.semver();
    },
  },
};

export default dataTypes;
