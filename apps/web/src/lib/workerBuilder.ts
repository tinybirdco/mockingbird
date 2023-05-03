import type {
  TinybirdConfig,
  UpstashKafkaConfig,
} from '@tinybirdco/mockingbird'

export function createWorker(
  generator: 'Tinybird' | 'UpstashKafka',
  config: TinybirdConfig | UpstashKafkaConfig,
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
