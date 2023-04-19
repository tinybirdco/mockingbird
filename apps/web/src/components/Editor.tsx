import _isEqual from 'lodash.isequal'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Content, JSONContent, TextContent } from 'vanilla-jsoneditor'

import { CheckmarkIcon } from '@/components/Icons'
import { compressJSON, decompressJSON } from '@/lib/helpers'
import { cx } from '@/lib/utils'
import {
  PRESET_SCHEMA_NAMES,
  presetSchemas,
  Schema,
  TinybirdGenerator,
  validateSchema,
} from '@tinybirdco/mockingbird'

const JSONEditor = dynamic(() => import('@/components/JSONEditor'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

const TEMPLATE_OPTIONS = [...PRESET_SCHEMA_NAMES, 'Custom'] as const
type PresetSchemaNameWithCustom = (typeof TEMPLATE_OPTIONS)[number]

type EditorProps = {
  onSchemaChange: (schema: Schema) => void
  isSaved: boolean
}

export default function Editor({ onSchemaChange, isSaved }: EditorProps) {
  const router = useRouter()
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [template, setTemplate] = useState<PresetSchemaNameWithCustom>('Custom')
  const [content, setContent] = useState<Content>({
    json: '',
  })
  const [sampleCode, setSampleCode] = useState('Click Save to preview...')

  useEffect(() => {
    if (!router.isReady) return

    const template = router.query.template as string | undefined
    const schema = router.query.schema as string | undefined

    if (
      template &&
      TEMPLATE_OPTIONS.includes(template as PresetSchemaNameWithCustom)
    ) {
      onTemplateChange(template as PresetSchemaNameWithCustom)
    } else if (schema && schema !== 'Preset') {
      try {
        const json = JSON.parse(decompressJSON(schema))
        setContent({ json })
      } catch (e) {
        console.error(e)
        onTemplateChange('Default')
      }
    } else {
      onTemplateChange('Default')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const isJSONContent = (content: Content): content is JSONContent =>
    'json' in content

  const onContentChange = (newContent: Content) => {
    if (template !== 'Custom') {
      try {
        const parsedContent = isJSONContent(newContent)
          ? (newContent as JSONContent).json
          : JSON.parse((newContent as TextContent).text)

        if (!_isEqual(parsedContent, presetSchemas[template]))
          setTemplate('Custom')
      } catch (e) {
        console.error(e)
        setTemplate('Custom')
      }
    }

    setContent(newContent)
    onSchemaChange({})
  }

  const onTemplateChange = (newTemplate: PresetSchemaNameWithCustom) => {
    setTemplate(newTemplate)

    if (newTemplate !== 'Custom')
      setContent({ json: presetSchemas[newTemplate] } as JSONContent)

    onSchemaChange({})
  }

  const onSchemaSave = () => {
    try {
      const schema = (
        isJSONContent(content)
          ? (content as JSONContent).json
          : JSON.parse((content as TextContent).text)
      ) as Schema
      const validation = validateSchema(schema!)
      setValidationErrors(validation.errors)

      if (schema && validation.valid) {
        setValidationErrors([])
        const rowGenerator = new TinybirdGenerator({
          schema,
          datasource: '',
          endpoint: '',
          token: '',
          eps: 1,
          limit: -1,
        }).createRowGenerator()
        setSampleCode(JSON.stringify(rowGenerator.generate(), null, 4))

        if (
          template !== 'Custom' &&
          JSON.stringify(schema, null, 4) !==
            JSON.stringify(presetSchemas[template], null, 4)
        ) {
          setTemplate('Custom')
        }

        const urlParams = new URLSearchParams({
          ...router.query,
          template,
          schema: template === 'Custom' ? compressJSON(schema) : 'Preset',
        })
        router.push(`?${urlParams}`, undefined, { scroll: false })

        onSchemaChange(schema)
      }
    } catch (e) {
      console.error(e)
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
            value={template}
            onChange={e =>
              onTemplateChange(e.target.value as PresetSchemaNameWithCustom)
            }
          >
            {TEMPLATE_OPTIONS.map(presetSchemaName => (
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
            {isSaved && <CheckmarkIcon className="w-5 h-5 fill-white" />}
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
        onRenderMenu={(items, _context) =>
          items.filter(item => ('text' in item ? item.text !== 'table' : true))
        }
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
