import { useRouter } from 'next/router'

import {
  TinybirdConfig,
  TinybirdGenerator,
  UpstashKafkaConfig,
  UpstashKafkaGenerator,
} from '@tinybirdco/mockingbird'

export default function useGeneratorConfig():
  | {
      onConfigChange: (
        generator: 'Tinybird' | 'UpstashKafka',
        config:
          | Omit<TinybirdConfig, 'schema'>
          | Omit<UpstashKafkaConfig, 'schema'>
      ) => void
      overviewItems: { title: string; value: string | number }[]
    } & (
      | {
          generator: 'Tinybird'
          config: Omit<TinybirdConfig, 'schema'>
        }
      | {
          generator: 'UpstashKafka'
          config: Omit<UpstashKafkaConfig, 'schema'>
        }
      | {
          generator: null
          config: {}
        }
    ) {
  const router = useRouter()

  const onConfigChange = (
    generator: 'Tinybird' | 'UpstashKafka',
    config: Omit<TinybirdConfig | UpstashKafkaConfig, 'schema'>
  ) => {
    // Validation
    if (generator === 'Tinybird') {
      new TinybirdGenerator({ ...config, schema: {} } as TinybirdConfig)
    } else if (generator === 'UpstashKafka') {
      new UpstashKafkaGenerator({ ...config, schema: {} } as UpstashKafkaConfig)
    }

    const urlParams = new URLSearchParams({
      ...Object.fromEntries(
        Object.entries(router.query).map(([key, value]) => [
          key,
          value ? value.toString() : '',
        ])
      ),
      ...Object.fromEntries(
        Object.entries(config).map(([key, value]) => [key, value.toString()])
      ),
      generator,
    })
    router.push(`?${urlParams}`, undefined, { scroll: false })
  }

  const generator = router.query.generator as string | undefined
  if (generator === 'Tinybird') {
    const config: Omit<TinybirdConfig, 'schema'> = {
      endpoint: (router.query.endpoint as string | undefined) ?? '',
      token: (router.query.token as string | undefined) ?? '',
      datasource: (router.query.datasource as string | undefined) ?? '',
      eps: parseInt((router.query.eps as string | undefined) ?? '1'),
      limit: parseInt((router.query.limit as string | undefined) ?? '-1'),
    }
    const overviewItems = [
      {
        title: 'Events Per Seconds',
        value: config.eps,
      },
      {
        title: 'Limit',
        value: config.limit,
      },
      {
        title: 'Destination',
        value: 'Tinybird Events API',
      },
      {
        title: 'Data Source',
        value: config.datasource,
      },
    ]
    return { generator, onConfigChange, config, overviewItems }
  } else if (generator === 'UpstashKafka') {
    const config: Omit<UpstashKafkaConfig, 'schema'> = {
      address: (router.query.address as string | undefined) ?? '',
      user: (router.query.user as string | undefined) ?? '',
      pass: (router.query.pass as string | undefined) ?? '',
      topic: (router.query.topic as string | undefined) ?? '',
      eps: parseInt((router.query.eps as string | undefined) ?? '1'),
      limit: parseInt((router.query.limit as string | undefined) ?? '-1'),
    }
    const overviewItems = [
      {
        title: 'Events Per Seconds',
        value: config.eps,
      },
      {
        title: 'Limit',
        value: config.limit,
      },
      {
        title: 'Destination',
        value: 'Upstash Kafka',
      },
      {
        title: 'Topic',
        value: config.topic,
      },
    ]
    return { generator, onConfigChange, config, overviewItems }
  }

  return { generator: null, onConfigChange, config: {}, overviewItems: [] }
}
