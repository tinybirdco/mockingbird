import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

import Editor from '@/components/Editor'
import Layout from '@/components/Layout'
import MessageCount from '@/components/MessageCount'
import useGeneratorWorker from '@/lib/useGeneratorWorker'
import { cx } from '@/lib/utils'
import { Schema } from '@tinybirdco/mockingbird'

export default function Home() {
  const router = useRouter()
  const [schema, setSchema] = useState<Schema>({})
  const isSaved = Object.keys(schema).length > 0

  const config = {
    endpoint: (router.query.host as string | undefined) ?? '',
    token: (router.query.token as string | undefined) ?? '',
    datasource: (router.query.datasource as string | undefined) ?? '',
    eps: parseInt((router.query.eps as string | undefined) ?? '1'),
    limit: -1,
    schema,
  }

  const { startGenerating, stopGenerating, isGenerating, sentMessages } =
    useGeneratorWorker(config, isSaved)

  const onGenerationClick = () => {
    isGenerating ? stopGenerating() : startGenerating()
  }

  return (
    <>
      <Head>
        <title>Mockingbird</title>
        <meta name="description" content="Data generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="mt-8 mb-16 md:mt-16 md:mb-32">
          <h1 className="font-bold text-5xl tracking-[-0.01em] text-center ">
            Mockingbird
          </h1>

          <div className="h-4" />

          <h4 className="text-lg text-tb-text1">
            Generate synthetic data streams to send to Tinybird via the Events
            API. Design your own schema, or choose from one of our pre-existing
            templates
          </h4>
        </div>

        <Editor onSchemaChange={setSchema} isSaved={isSaved} />

        <div className="h-12" />

        <button
          className={cx(
            'btn-base w-full bg-tb-primary text-white hover:scale-105',
            !isSaved && 'bg-opacity-40 cursor-not-allowed'
          )}
          disabled={!isSaved}
          onClick={onGenerationClick}
        >
          {isGenerating ? 'Stop' : 'Start'} Generating!
        </button>

        <div className="h-24" />

        <MessageCount sentMessages={sentMessages} />

        <div className="h-24" />
      </Layout>
    </>
  )
}
