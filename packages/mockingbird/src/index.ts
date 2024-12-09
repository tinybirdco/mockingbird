// Browser-safe exports
export { default as extendedFaker } from "./extendedFaker";
export * from "./types";
export { presetSchemas } from "./schemas";

// Basic generators that work in browser
export {
  AblyGenerator,
  TinybirdGenerator,
  AWSSNSGenerator,
} from "./generators";
export { LogGenerator } from "./generators";

export type { MockingbirdGenerator } from "./generators";

// Node.js specific exports (these should not be imported in browser)
export const NodeGenerators = {
  get AWSKinesisGenerator() {
    return import("./generators/AWSKinesisGenerator").then((m) => m.default);
  },
  get ConfluentCloudKafkaGenerator() {
    return import("./generators/ConfluentCloudKafkaGenerator").then(
      (m) => m.default
    );
  },
  get GoogleSpannerGenerator() {
    return import("./generators/GoogleSpannerGenerator").then((m) => m.default);
  },
  get RabbitMQGenerator() {
    return import("./generators/RabbitMQGenerator").then((m) => m.default);
  },
};

// Type exports
export type {
  AWSSNSConfig,
  AblyConfig,
  TinybirdConfig,
  AWSKinesisConfig,
  GoogleSpannerConfig,
  RabbitMQConfig,
  ConfluentCloudKafkaConfig,
} from "./generators";
