import { useState } from 'react'

import { createWorker, startWorker, stopWorker } from '@/lib/workerBuilder'
import { TinybirdConfig } from '@tinybirdco/mockingbird'

export default function useGeneratorWorker(
  config: TinybirdConfig,
  canGenerate: boolean
) {
  const [worker, setWorker] = useState<Worker>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [sentMessages, setSentMessages] = useState({
    total: 0,
    session: 0,
  })

  function startGenerating() {
    if (canGenerate) {
      const createdWorker = createWorker(
        config,
        ({ data }: MessageEvent<number>) => {
          setSentMessages(prev => ({
            total: prev.total + data,
            session: prev.session + data,
          }))
        },
        e => {
          console.log(e)
        }
      )

      if (!createdWorker) return

      setWorker(createdWorker)
      startWorker(createdWorker)
      setIsGenerating(true)
      setSentMessages(prev => ({ total: prev.total, session: 0 }))
    }
  }

  // Stops the background generator worker
  function stopGenerating() {
    if (!worker) return

    stopWorker(worker)
    setWorker(undefined)
    setIsGenerating(false)
  }

  return { startGenerating, stopGenerating, isGenerating, sentMessages }
}
