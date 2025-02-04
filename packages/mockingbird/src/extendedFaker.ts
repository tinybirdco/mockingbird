import { faker } from "@faker-js/faker";

// const faker = new Faker({ locale: en });

type MockingbirdModule = {
  datetimeNow: () => string;
  timestampNow: () => string;
};

const mockingbirdModule: MockingbirdModule = {
  datetimeNow: () => new Date().toISOString().slice(0, 19),
  timestampNow: () => new Date().toISOString(),
};

// Only expose the functions we need to avoid type issues with internal faker types
export const extendedFaker = {
  airline: faker.airline,
  animal: faker.animal,
  color: faker.color,
  commerce: faker.commerce,
  company: faker.company,
  database: faker.database,
  date: faker.date,
  finance: faker.finance,
  git: faker.git,
  hacker: faker.hacker,
  helpers: faker.helpers,
  image: faker.image,
  internet: faker.internet,
  location: faker.location,
  music: faker.music,
  number: faker.number,
  person: faker.person,
  phone: faker.phone,
  science: faker.science,
  string: faker.string,
  system: faker.system,
  vehicle: faker.vehicle,
  word: faker.word,
  datatype: faker.datatype,
  mockingbird: mockingbirdModule,
} as const;
