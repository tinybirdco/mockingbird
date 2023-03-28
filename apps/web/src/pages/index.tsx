import Layout from '@/components/Layout'
import { decompressJSON, compressJSON } from '@/lib/helpers'
import { cx } from '@/lib/utils'
import { createWorker, startWorker, stopWorker } from '@/lib/workerBuilder'
import {
  createRowGenerator,
  initializeGenerator,
  presetSchemas,
  TinybirdSchema,
  validateSchema,
} from '@tinybirdco/mockingbird'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()

  const [presetTemplate, setPresetTemplate] = useState({
    name: '' as (keyof typeof presetSchemas & string) | null,
    value: '',
  })
  const [worker, setWorker] = useState<Worker>()
  const [isSaved, setIsSaved] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [schema, setSchema] = useState<TinybirdSchema>()
  const [sampleCode, setSampleCode] = useState('Click Save to preview...')
  const [sentMessages, setSentMessages] = useState({
    total: 0,
    session: 0,
  })

  useEffect(() => {
    const schema = router.query.schema as string | undefined

    let presetTemplateName = null,
      presetTemplateValue = ''
    if (schema && schema in presetSchemas) {
      presetTemplateName = schema as keyof typeof presetSchemas
      presetTemplateValue = JSON.stringify(
        presetSchemas[schema as keyof typeof presetSchemas],
        null,
        4
      )
    } else if (schema) {
      const textJson = decompressJSON(schema)
      presetTemplateValue = JSON.stringify(JSON.parse(textJson), null, 4)
    } else {
      presetTemplateName = 'Default' as keyof typeof presetSchemas
      presetTemplateValue = JSON.stringify(presetSchemas.Default, null, 4)
    }

    setPresetTemplate({
      name: presetTemplateName,
      value: presetTemplateValue,
    })
  }, [router.query.schema])

  function startGenerating() {
    if (!schema) return

    const endpoint = (router.query.host as string | undefined) ?? '',
      token = (router.query.token as string | undefined) ?? '',
      datasource = (router.query.datasource as string | undefined) ?? '',
      eps = parseInt((router.query.eps as string | undefined) ?? '1')

    const workerParams = {
      schema,
      datasource,
      endpoint,
      token,
      eps,
      limit: -1,
    }

    if (
      schema &&
      initializeGenerator({ datasource, endpoint, token }, true) &&
      isSaved
    ) {
      const createdWorker = createWorker(
        workerParams,
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

  const onTemplateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const schema = e.target.value as keyof typeof presetSchemas & string
    const urlParams = new URLSearchParams({
      ...router.query,
      schema,
    })
    router.push(`?${urlParams}`)

    setPresetTemplate({
      name: schema,
      value: JSON.stringify(presetSchemas[schema], null, 4),
    })
  }

  const onSaveSchemaClick = () => {
    try {
      const schema = JSON.parse(presetTemplate.value)
      const validation = validateSchema(schema!)
      setValidationErrors(validation.errors)

      if (schema && validation.valid) {
        const presetTemplateValue = JSON.stringify(schema, null, 4)
        setValidationErrors([])
        const rowGenerator = createRowGenerator(schema)
        setSampleCode(JSON.stringify(rowGenerator.generate(), null, 4))

        if (
          presetTemplate.name &&
          presetTemplateValue !==
            JSON.stringify(presetSchemas[presetTemplate.name], null, 4)
        ) {
          setPresetTemplate({
            name: null,
            value: presetTemplateValue,
          })
        }

        if (!presetTemplate.name) {
          let lzma = compressJSON(schema)
          const urlParams = new URLSearchParams({
            ...router.query,
            schema: lzma,
          })
          router.push(`?${urlParams}`)
        }

        setSchema(schema)
        setIsSaved(true)
      }
    } catch (e) {
      setValidationErrors([(e as Error).toString()])
      setSampleCode('Save to start generating')
    }
  }

  const onGenerationClick = () => {
    if (isGenerating) stopGenerating()
    else startGenerating()
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
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 rounded shadow-lg bg-white p-6 flex flex-col gap-2">
            <p className="text-2xl font-semibold">{sentMessages.total}</p>
            <p className="text-xl font-normal text-gray-600">
              Messages Sent (Total)
            </p>
          </div>

          <div className="flex-1 rounded shadow-lg bg-white p-6 flex flex-col gap-2">
            <p className="text-2xl font-semibold">{sentMessages.session}</p>
            <p className="text-xl font-normal text-gray-600">
              Messages Sent (Session)
            </p>
          </div>
        </div>

        <button
          className={cx(
            'btn-base w-full my-4 bg-tb_emerald text-white',
            !isSaved && 'bg-opacity-40'
          )}
          disabled={!isSaved}
          onClick={onGenerationClick}
        >
          {isGenerating ? 'Stop' : 'Start'} Generating!
        </button>

        <div className="rounded shadow-lg bg-white p-6 flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="font-bold">Use a template</p>
            <select
              className="input-base"
              value={presetTemplate.name ?? ''}
              onChange={onTemplateChange}
            >
              {Object.keys(presetSchemas).map(presetSchemaName => (
                <option key={presetSchemaName} value={presetSchemaName}>
                  {presetSchemaName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <h2>Schema Builder</h2>
              <textarea
                value={presetTemplate.value}
                onChange={e =>
                  setPresetTemplate({
                    ...presetTemplate,
                    value: e.target.value,
                  })
                }
                className="min-h-[8rem] max-h-[40rem] overflow-y-auto p-3 border outline-gray-300 focus:outline-cyan-500"
              />
              <button
                className="btn-base bg-tb_capri text-white"
                onClick={onSaveSchemaClick}
              >
                Save
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <h2>Data Preview</h2>
              <div className="min-h-[8rem] max-h-[40rem] overflow-y-auto p-3 bg-stone-50 whitespace-pre-wrap">
                {sampleCode}
              </div>
            </div>
          </div>
          {validationErrors.length > 0 && (
            <ul>
              {validationErrors.map(validationError => (
                <li key={validationError} className="text-red-500">
                  {validationError}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Layout>
    </>
  )
}
