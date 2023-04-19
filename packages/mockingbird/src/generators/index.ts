export type MockingbirdGenerator = InstanceType<
  typeof import("./BaseGenerator").default
>;
export {
  default as TinybirdGenerator,
  TinybirdConfig,
  TinybirdMessage,
} from "./TinybirdGenerator";
export {
  default as UpstashKafkaGenerator,
  UpstashKafkaConfig,
  UpstashKafkaMessage,
} from "./UpstashKafkaGenerator";
