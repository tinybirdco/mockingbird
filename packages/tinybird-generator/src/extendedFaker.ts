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

const browserModule = {
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
};

const extendedFaker = {
  ...faker,
  helpers: { ...faker.helpers, weightedRandom },
  browser: browserModule,
};

export default extendedFaker;
