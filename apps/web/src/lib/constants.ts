import {
  AWSSNSConfig,
  AWSSNSGenerator,
  AblyConfig,
  AblyGenerator,
  ConfluentCloudKafkaConfig,
  ConfluentCloudKafkaGenerator,
  PRESET_SCHEMA_NAMES,
  TinybirdConfig,
  TinybirdGenerator,
  UpstashKafkaConfig,
  UpstashKafkaGenerator,
} from '@tinybirdco/mockingbird'

export const steps = [
  {
    id: 'connect-step',
    title: 'Connect.',
    description: 'Select a destination and configure your project settings.',
  },
  {
    id: 'build-step',
    title: 'Build the schema.',
    description:
      'Define the structure of your data from scratch or using a template.',
  },
  {
    id: 'overview-step',
    title: 'Generate data.',
    description:
      'Mockingbird will generate and stream events to your selected destination.',
  },
] as const

export const destinations = [
  {
    title: 'Tinybird Events API',
    generator: 'Tinybird',
    icon: '/destinations/tinybird.svg',
  },
  {
    title: 'Upstash Kafka',
    generator: 'UpstashKafka',
    icon: '/destinations/upstash-kafka.svg',
  },
  {
    title: 'Confluent Cloud',
    generator: 'ConfluentCloudKafka',
    icon: '/destinations/confluent.svg',
  },
  {
    title: 'Ably',
    generator: 'Ably',
    icon: '/destinations/ably.svg',
  },
  {
    title: 'AWS SNS',
    generator: 'AWSSNS',
    icon: '/destinations/awssns.svg',
  },
] as const
export type Destination = (typeof destinations)[number]
export type MockingbirdGeneratorName = Destination['generator']

export const TEMPLATE_OPTIONS = [...PRESET_SCHEMA_NAMES, 'Custom'] as const
export type PresetSchemaNameWithCustom = (typeof TEMPLATE_OPTIONS)[number]

export const nameToGenerator = {
  Ably: AblyGenerator,
  AWSSNS: AWSSNSGenerator,
  ConfluentCloudKafka: ConfluentCloudKafkaGenerator,
  Tinybird: TinybirdGenerator,
  UpstashKafka: UpstashKafkaGenerator,
} as const

export type MockingbirdConfig =
  | AblyConfig
  | AWSSNSConfig
  | ConfluentCloudKafkaConfig
  | TinybirdConfig
  | UpstashKafkaConfig

export const ablyConfigItems = [
  {
    id: 'channelId',
    label: 'Channel ID',
    required: true,
  },
  {
    id: 'apiKey',
    label: 'API Key',
    required: true,
  },
]

export const awsSnsConfigItems = [
  {
    id: 'region',
    label: 'Region',
    required: true,
  },
  {
    id: 'accessKeyId',
    label: 'Access Key',
    required: true,
  },
  {
    id: 'secretAccessKey',
    label: 'Secret Key',
    required: true,
    type: 'password',
  },
]

export const confluentCloudKafkaConfigItems = [
  {
    id: 'restEndpoint',
    label: 'REST Endpoint',
    required: true,
    type: 'url',
  },
  {
    id: 'clusterId',
    label: 'Cluster ID',
    required: true,
  },
  {
    id: 'topic',
    label: 'Topic',
    required: true,
  },
  {
    id: 'apiKey',
    label: 'API Key',
    required: true,
  },
  {
    id: 'apiSecret',
    label: 'API Secret',
    required: true,
    type: 'password',
  },
]

export const tinybirdConfigItems = [
  {
    id: 'endpoint',
    label: 'Endpoint',
  },
  {
    id: 'token',
    label: 'Token',
  },
  {
    id: 'datasource',
    label: 'Datasource',
  },
]

export const upstashKafkaConfigItems = [
  {
    id: 'address',
    label: 'REST URL',
    required: true,
    type: 'url',
  },
  {
    id: 'user',
    label: 'REST Username',
    required: true,
  },
  {
    id: 'pass',
    label: 'REST Password',
    required: true,
    type: 'password',
  },
  {
    id: 'topic',
    label: 'Topic',
    required: true,
  },
]

export const nameToConfigItems: Record<
  MockingbirdGeneratorName,
  Array<{ id: string; label: string }>
> = {
  Ably: ablyConfigItems,
  AWSSNS: awsSnsConfigItems,
  ConfluentCloudKafka: confluentCloudKafkaConfigItems,
  Tinybird: tinybirdConfigItems,
  UpstashKafka: upstashKafkaConfigItems,
}
