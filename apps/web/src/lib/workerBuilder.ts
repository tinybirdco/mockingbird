import { MockingbirdGeneratorName, MockingbirdConfig } from './constants'

export function createWorker(
  generator: MockingbirdGeneratorName,
  config: MockingbirdConfig,
  onMessage?: (message: MessageEvent<number | { error: string }>) => void,
  onError?: (e: ErrorEvent) => void
) {
  if (!window.Worker) return null

  const worker = new Worker(new URL('./worker.ts', import.meta.url), {
    type: 'module',
  })

  if (onMessage) {
    worker.onmessage = (event) => {
      if (typeof event.data === 'object' && 'error' in event.data) {
        console.error('Worker error:', event.data.error)
        if (onError) onError(new ErrorEvent('error', { error: new Error(event.data.error) }))
      } else {
        onMessage(event)
      }
    }
  }
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
