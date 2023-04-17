import Head from 'next/head'
import { useState } from 'react'

import BuildStep from '@/components/steps/BuildStep'
import ConnectStep from '@/components/steps/ConnectStep'
import Landing from '@/components/steps/Landing'
import OverviewStep from '@/components/steps/OverviewStep'
import { steps } from '@/lib/constants'
import useGeneratorWorker from '@/lib/hooks/useGeneratorWorker'
import useStep from '@/lib/hooks/useStep'
import { Schema } from '@tinybirdco/mockingbird'

export default function Home() {
  const [step, helpers] = useStep(0, steps.length)
  const [schema, setSchema] = useState<Schema>({})
  const isSaved = Object.keys(schema).length > 0

  const { startGenerating, stopGenerating, isGenerating, sentMessages } =
    useGeneratorWorker(schema, isSaved)

  const onGenerationStartClick = () => {
    startGenerating()
    helpers.goToNextStep()
  }

  const onGenerationStopClick = () => {
    isGenerating ? stopGenerating() : startGenerating()
  }

  const stepToComponent = [
    <Landing key="landing" helpers={helpers} />,
    <ConnectStep key="connect" helpers={helpers} />,
    <BuildStep
      key="build"
      onSchemaChange={setSchema}
      isSaved={isSaved}
      onGenerationStartClick={onGenerationStartClick}
    />,
    <OverviewStep
      key="overview"
      sentMessages={sentMessages}
      isGenerating={isGenerating}
      onGenerationStopClick={onGenerationStopClick}
    />,
  ] as const

  return (
    <>
      <Head>
        <title>Mockingbird</title>
        <meta name="description" content="Data generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {stepToComponent[step]}
    </>
  )
}
