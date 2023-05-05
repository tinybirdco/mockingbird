import type {
  TinybirdConfig,
  UpstashKafkaConfig,
  AblyConfig,
  ConfluentCloudKafkaConfig,
  AWSSNSConfig
} from '@tinybirdco/mockingbird'

export function createWorker(
  generator: 'Tinybird' | 'UpstashKafka' | 'Ably' | 'ConfluentCloudKafka' | 'AWSSNS',
  config: TinybirdConfig | UpstashKafkaConfig | AblyConfig | ConfluentCloudKafkaConfig | AWSSNSConfig,
  onMessage?: (message: MessageEvent<number>) => void,
  onError?: (e: ErrorEvent) => void
) {
  if (!window.Worker) return null

  const worker = new Worker(new URL('./worker.ts', import.meta.url), {
    type: 'module',
  })

  if (onMessage) worker.onmessage = onMessage
  if (onError) worker.onerror = onError

  worker.postMessage({
    init: config.schema,
    generator,
    config,
  })

  return worker
}

export function startWorker(worker: Worker) {
  worker.postMessage({})
}

export function stopWorker(worker: Worker) {
  worker.terminate()
}
