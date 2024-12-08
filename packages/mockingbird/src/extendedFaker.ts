import { faker } from "@faker-js/faker";

const helpersModule = {
  weightedRandom(items: unknown[], weights: number[]) {
    return faker.helpers.weightedArrayElement(
      new Array(items.length).fill(null).map((_, i) => ({
        weight: weights[i],
        value: items[i],
      }))
    );
  },
  normalDistribution() {
    function boxMullerRandom(): number {
      let u = 0,
        v = 0;
      while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
      while (v === 0) v = Math.random();
      let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      num = num / 10.0 + 0.5; // Translate to 0 -> 1
      if (num > 1 || num < 0) return boxMullerRandom(); // resample between 0 and 1
      return num;
    }

    return boxMullerRandom();
  },
};

const mockingbirdModule = {
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
    opts: { state: Record<string, unknown> } | undefined
  ) => {
    if (!opts) return;
    const state = opts.state;

    const key = `pickType.${JSON.stringify({
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
    params: { values: unknown[]; iterations?: number },
    opts: { state: Record<string, unknown> } | undefined
  ) => {
    if (!opts) return;
    const state = opts.state;

    const indexKey = `sequentialArray.${JSON.stringify(params.values)}.index`,
      iterationKey = `sequentialArray.${JSON.stringify(
        params.values
      )}.iteration`;
    let currentIndex = Number(state[indexKey] ?? 0),
      currentIteration = Number(state[iterationKey] ?? 0);

    if (currentIteration >= (params.iterations ?? 1)) {
      currentIndex = (currentIndex + 1) % params.values.length;
      currentIteration = 0;
    }

    const value = params.values[currentIndex];

    state[indexKey] = currentIndex;
    state[iterationKey] = currentIteration + 1;

    return value;
  },
};

const extendedFaker = {
  ...faker,
  helpers: { ...faker.helpers, ...helpersModule },
  mockingbird: mockingbirdModule,
};

export default extendedFaker;
