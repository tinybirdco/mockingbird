import { faker } from "@faker-js/faker";

const helpersModule = {
  weightedRandom(items: unknown[], weights: number[]) {
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
  },
  normalDistribution(min: number = 0, max: number = 1, skew: number = 1) {
    const boxMullerRandom = (min: number, max: number, skew: number) => {
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

    return boxMullerRandom(min, max, skew);
  },
};

const mockingbirdModule = {
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
  pickType: (
    params: { type: keyof typeof faker.datatype; length: number },
    { state }: { state: Record<string, unknown> }
  ) => {
    const key = `sequentialArray.${JSON.stringify({
      type: params.type,
      length: params.length,
    })}`;

    const arr =
      (state[key] as Array<unknown>) ??
      new Array(params.length || 1)
        .fill(null)
        .map(() => faker.datatype[params.type]());
    const value = arr.shift();
    state[key] = arr;
    return value;
  },
  pick: (params: { values: unknown[]; distribution?: "random" | "normal" }) =>
    params.values[
      Math.floor(
        (!params.distribution || params.distribution === "random"
          ? Math.random()
          : helpersModule.normalDistribution()) * params.values.length
      )
    ],
  pickWeighted: (params: { values: unknown[]; weights: number[] }) =>
    helpersModule.weightedRandom(params.values, params.weights),
  sequentialArray: (
    params: { values: unknown[] },
    { state }: { state: Record<string, unknown> }
  ) => {
    const key = `sequentialArray.${JSON.stringify(params.values)}`;
    const index = Number(state[key] || 0);
    const value = params.values[index % params.values.length];
    state[key] = index + 1;
    return value;
  },
};

const extendedFaker = {
  ...faker,
  helpers: { ...faker.helpers, ...helpersModule },
  mockingbird: mockingbirdModule,
};

export default extendedFaker;
