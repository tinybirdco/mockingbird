import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Content, JSONContent } from 'vanilla-jsoneditor'

import { CheckmarkIcon } from '@/components/Icons'
import { compressJSON, decompressJSON } from '@/lib/helpers'
import { cx } from '@/lib/utils'
import {
  createRowGenerator,
  presetSchemas,
  TinybirdSchema,
  validateSchema,
} from '@tinybirdco/mockingbird'

const JSONEditor = dynamic(() => import('@/components/JSONEditor'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

type PresetTemplate = keyof typeof presetSchemas & string

type EditorProps = {
  onSchemaChange: (schema: TinybirdSchema) => void
  isSaved: boolean
  onIsSavedChange: (isSaved: boolean) => void
}

export default function Editor({
  onSchemaChange,
  isSaved,
  onIsSavedChange,
}: EditorProps) {
  const router = useRouter()
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [template, setTemplate] = useState<PresetTemplate | ''>('')
  const [content, setContent] = useState<Content>({
    json: '',
  })
  const [sampleCode, setSampleCode] = useState('Click Save to preview...')

  useEffect(() => {
    if (!router.isReady) return

    const template = router.query.template as string | undefined
    const schema = router.query.schema as string | undefined

    if (template && template in presetSchemas) {
      onTemplateChange(template as PresetTemplate)
    } else if (schema) {
      const json = JSON.parse(decompressJSON(schema))
      setContent({ json })
    } else {
      onTemplateChange('Default')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.template, router.query.schema])

  const onContentChange = (newContent: Content) => {
    setContent(newContent)
    onIsSavedChange(false)
  }

  const onTemplateChange = (newTemplate: PresetTemplate) => {
    const newContent = presetSchemas[newTemplate]
    const urlParams = new URLSearchParams({
      ...router.query,
      template: newTemplate,
    })
    router.push(`?${urlParams}`)

    setTemplate(newTemplate)
    setContent({ json: newContent })
    onIsSavedChange(false)
  }

  const onSchemaSave = () => {
    try {
      const schema = (content as JSONContent).json as TinybirdSchema
      const validation = validateSchema(schema!)
      setValidationErrors(validation.errors)

      if (schema && validation.valid) {
        setValidationErrors([])
        const rowGenerator = createRowGenerator(schema)
        setSampleCode(JSON.stringify(rowGenerator.generate(), null, 4))

        if (
          template !== '' &&
          JSON.stringify(schema, null, 4) !==
            JSON.stringify(presetSchemas[template], null, 4)
        ) {
          setTemplate('')
        }

        if (template === '') {
          let lzma = compressJSON(schema)
          const urlParams = new URLSearchParams({
            ...router.query,
            schema: lzma,
          })
          router.push(`?${urlParams}`)
        }

        onSchemaChange(schema)
        onIsSavedChange(true)
      }
    } catch (e) {
      setValidationErrors([(e as Error).toString()])
      setSampleCode('Save to start generating')
    }
  }

  return (
    <div className="flex flex-col card">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-0">
        <h2 className="text-3xl font-semibold">Schema Designer</h2>
        <div className="flex items-center justify-between gap-4 md:justify-start">
          <select
            className="input-base"
            value={template ?? ''}
            onChange={e => onTemplateChange(e.target.value as PresetTemplate)}
          >
            {Object.keys(presetSchemas).map(presetSchemaName => (
              <option key={presetSchemaName} value={presetSchemaName}>
                {presetSchemaName}
              </option>
            ))}
          </select>
          <button
            className={cx(
              'py-[10px] px-[14px] flex items-center gap-4 bg-tb-primary rounded-[4px] shadow-[0px_1px_3px_rgba(11,19,36,0.1)] text-sm text-white tracking-[-0.01em] hover:scale-105',
              isSaved && 'bg-opacity-40 cursor-not-allowed'
            )}
            disabled={isSaved}
            onClick={onSchemaSave}
          >
            <span>{isSaved ? 'Saved' : 'Save'}</span>
            {isSaved && <CheckmarkIcon />}
          </button>
        </div>
      </div>

      <div className="h-6" />

      <p className="font-medium text-[22px] leading-7 text-tb-text1">Schema</p>

      <div className="h-6" />

      <JSONEditor
        content={content}
        onChange={onContentChange}
        statusBar={false}
      />

      <div className="h-11" />

      <p className="font-medium text-[22px] leading-7 text-tb-text1">Preview</p>

      <div className="h-6" />

      <div className="preview">{sampleCode}</div>

      {validationErrors.length > 0 && (
        <ul className="my-4">
          {validationErrors.map(validationError => (
            <li key={validationError} className="text-red-500">
              {validationError}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
