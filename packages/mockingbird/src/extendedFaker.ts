import { faker } from "@faker-js/faker";

function weightedRandom(items: unknown[], weights: number[]) {
  let i;
  let localWeights = [...weights];

  for (i = 0; i < localWeights.length; i++) {
    localWeights[i] += localWeights[i - 1] || 0;
  }

  let random = Math.random() * localWeights[localWeights.length - 1];

  for (i = 0; i < localWeights.length; i++) {
    if (localWeights[i] > random) break;
  }

  return items[i];
}

const mockingbirdModule = Object.assign(
  {
    latitudeNumeric: () => faker.location.latitude(),
    longitudeNumeric: () => faker.location.longitude(),
    searchEngineName() {
      const searchEngines = [
        "https://www.google.co.uk/",
        "https://www.bing.com/",
        "https://duckduckgo.com/",
        "https://yandex.com/",
        "https://yahoo.com",
      ];
      return faker.helpers.arrayElement(searchEngines);
    },
    osName() {
      const osNames = ["Linux", "Windows", "Mac OS"];
      return faker.helpers.arrayElement(osNames);
    },
    browserName() {
      const browserNames = ["Chrome", "Firefox", "IE", "Opera"];
      return faker.helpers.arrayElement(browserNames);
    },
    browserEngineName() {
      const browserEngineNames = ["Blink", "Gecko", "Trident"];
      return faker.helpers.arrayElement(browserEngineNames);
    },
    datetimeNow: () => new Date().toISOString().slice(0, 19),
    datetimeRecent: () => faker.date.recent().toISOString().slice(0, 19),
    datetimeBetween: (params: {
      start: string | number | Date;
      end: string | number | Date;
    }) =>
      faker.date
        .between({ from: params.start, to: params.end })
        .toISOString()
        .slice(0, 19),
    timestampNow: () => new Date().toISOString(),
    pick: (params: { values: unknown[] }) =>
      params.values[Math.floor(Math.random() * params.values.length)],
    pickWeighted: (params: { values: unknown[]; weights: number[] }) =>
      weightedRandom(params.values, params.weights),
    normalDistribution: (params: {
      min: number;
      max: number;
      skew: number;
    }) => {
      const boxMullerRandom = (
        min: number = 0,
        max: number = 1,
        skew: number = 1
      ) => {
        let u = 0,
          v = 0;
        while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) num = boxMullerRandom(min, max, skew);
        // resample between 0 and 1 if out of range
        else {
          num = Math.pow(num, skew); // Skew
          num *= max - min; // Stretch to fill range
          num += min; // offset to min
        }
        return num;
      };

      return boxMullerRandom(params.min, params.max, params.skew);
    },
    sequentialArray: (
      params: { values: string[] },
      state: Record<string, unknown>
    ) => {
      const key = `sequentialArray.${JSON.stringify(params.values)}`;
      const index = Number(state[key] || 0);
      const value = index < params.values.length ? params.values[index] : null;
      state[key] = index + 1;
      return value;
    },
  },
  {}
);

const extendedFaker = {
  ...faker,
  helpers: { ...faker.helpers, weightedRandom },
  mockingbird: mockingbirdModule,
};

export default extendedFaker;
