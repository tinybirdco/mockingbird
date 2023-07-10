import { HTMLInputTypeAttribute } from 'react'

import {
  AblyConfig,
  AblyGenerator,
  AWSSNSConfig,
  AWSSNSGenerator,
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
  Tinybird: TinybirdGenerator,
  UpstashKafka: UpstashKafkaGenerator,
} as const

export type MockingbirdConfig =
  | AblyConfig
  | AWSSNSConfig
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
] as const

export const awsSnsConfigItems = [
  {
    id: 'region',
    label: 'Region',
    required: true,
  },
  {
    id: 'topicArn',
    label: 'Topic ARN',
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
] as const

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
] as const

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
] as const

export type ConfigItem = {
  id: string
  label: string
  required?: boolean
  type?: HTMLInputTypeAttribute
}

export const nameToConfigItems: Record<
  MockingbirdGeneratorName,
  ReadonlyArray<ConfigItem>
> = {
  Ably: ablyConfigItems,
  AWSSNS: awsSnsConfigItems,
  Tinybird: tinybirdConfigItems,
  UpstashKafka: upstashKafkaConfigItems,
}
