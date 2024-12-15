import { Faker, en } from "@faker-js/faker";

const faker = new Faker({ locale: en });

type MockingbirdModule = {
  datetimeNow: () => string;
  timestampNow: () => string;
};

const mockingbirdModule: MockingbirdModule = {
  datetimeNow: () => new Date().toISOString().slice(0, 19),
  timestampNow: () => new Date().toISOString(),
};

export const extendedFaker = {
  ...faker,
  mockingbird: mockingbirdModule,
} as const;
