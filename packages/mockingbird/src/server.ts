export * from "./types";

export { extendedFaker } from "./extendedFaker";
export { presetSchemas } from "./schemas";

export type MockingbirdGenerator = InstanceType<
  typeof import("./generators/BaseGenerator").BaseGenerator
>;
export type { BaseConfig } from "./generators/BaseGenerator";
export { BaseGenerator } from "./generators/BaseGenerator";

export type { AWSSNSConfig } from "./generators/AWSSNSGenerator";
export { AWSSNSGenerator } from "./generators/AWSSNSGenerator";

export type { AblyConfig } from "./generators/AblyGenerator";
export { AblyGenerator } from "./generators/AblyGenerator";

export type { ConfluentCloudKafkaConfig } from "./generators/ConfluentCloudKafkaGenerator";
export { ConfluentCloudKafkaGenerator } from "./generators/ConfluentCloudKafkaGenerator";

export { LogGenerator } from "./generators/LogGenerator";

export type { RabbitMQConfig } from "./generators/RabbitMQGenerator";
export { RabbitMQGenerator } from "./generators/RabbitMQGenerator";

export type { TinybirdConfig } from "./generators/TinybirdGenerator";
export { TinybirdGenerator } from "./generators/TinybirdGenerator";

export type { AWSKinesisConfig } from "./generators/AWSKinesisGenerator";
export { AWSKinesisGenerator } from "./generators/AWSKinesisGenerator";

export type { GoogleSpannerConfig } from "./generators/GoogleSpannerGenerator";
export { GoogleSpannerGenerator } from "./generators/GoogleSpannerGenerator";
