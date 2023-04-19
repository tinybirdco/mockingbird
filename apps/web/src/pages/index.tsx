import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

import Layout from '@/components/Layout'
import BuildStep from '@/components/steps/BuildStep'
import ConnectStep from '@/components/steps/ConnectStep'
import Landing from '@/components/steps/Landing'
import OverviewStep from '@/components/steps/OverviewStep'
import { steps } from '@/lib/constants'
import useGeneratorWorker from '@/lib/hooks/useGeneratorWorker'
import useStep from '@/lib/hooks/useStep'
import { Schema } from '@tinybirdco/mockingbird'

export default function Home() {
  const endElRef = useRef<HTMLDivElement>(null)
  const [step, helpers] = useStep(0, steps.length)
  const [schema, setSchema] = useState<Schema>({})
  const isSaved = Object.keys(schema).length > 0

  const { startGenerating, stopGenerating, isGenerating, sentMessages } =
    useGeneratorWorker(schema, isSaved)

  useEffect(() => {
    if (isSaved && step === 2) {
      startGenerating()
      helpers.goToNextStep()
    }
  }, [isSaved, step, startGenerating, helpers])

  const onGenerationStopClick = () => {
    isGenerating ? stopGenerating() : startGenerating()
  }

  useEffect(() => {
    endElRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [step])

  const stepToComponent = [
    <Landing key="landing" step={step} helpers={helpers} />,
    <ConnectStep
      key="connect"
      step={step}
      helpers={helpers}
      isGenerating={isGenerating}
    />,
    <BuildStep
      key="build"
      step={step}
      onSchemaChange={setSchema}
      isSaved={isSaved}
      isGenerating={isGenerating}
    />,
    <OverviewStep
      key="overview"
      step={step}
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
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Layout>
        <Layout.LeftCol stepIndex={step} />
        <Layout.RightCol>
          <div className="flex flex-col gap-6">
            {stepToComponent.map(
              (component, index) => index <= step && component
            )}
          </div>

          <div ref={endElRef} />
        </Layout.RightCol>
      </Layout>
    </>
  )
}
