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
] as const
