import { useState } from 'react'

import { createWorker, startWorker, stopWorker } from '@/lib/workerBuilder'
import { Schema } from '@tinybirdco/mockingbird'
import useGeneratorConfig from './useGeneratorConfig'

export default function useGeneratorWorker(schema: Schema, isSaved: boolean) {
  const [worker, setWorker] = useState<Worker>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [sentMessages, setSentMessages] = useState({
    total: 0,
    session: 0,
  })
  const { generator, config: generatorConfig } = useGeneratorConfig()

  function startGenerating() {
    if (isSaved && generator) {
      const createdWorker = createWorker(
        generator,
        {
          schema,
          ...generatorConfig,
        },
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
