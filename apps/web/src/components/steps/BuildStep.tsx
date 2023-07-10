import _isEqual from 'lodash.isequal'
import dynamic from 'next/dynamic'
import { Dispatch } from 'react'

import { PresetSchemaNameWithCustom, TEMPLATE_OPTIONS } from '@/lib/constants'
import { Action, State } from '@/lib/state'
import { ArrowDownIcon } from '@tinybird/icons'
import { Button, Combobox } from '@tinybird/ui'

const JSONEditor = dynamic(() => import('@/components/JSONEditor'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

type BuildStepProps = {
  state: State
  dispatch: Dispatch<Action>
}

export default function BuildStep({ state, dispatch }: BuildStepProps) {
  const onTemplateChange = (value: string) => {
    dispatch({
      type: 'setTemplate',
      payload: value as PresetSchemaNameWithCustom,
    })
  }

  const onPreviewClick = () => {
    dispatch({ type: 'setSchema', payload: null })
  }

  const onStartGenerationClick = () => {
    dispatch({
      type: 'setSchemaAndStartGenerating',
      payload: {
        onMessage: ({ data }) =>
          dispatch({
            type: 'setSentMessages',
            payload: data,
          }),
        onError: console.error,
      },
    })
  }

  return (
    <div id="build-step" className="px-10 pt-8 pb-10 bg-white rounded-lg">
      <h3 className="text-lg font-semibold">Schema Designer</h3>

      <div className="h-6" />

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Schema</p>

        <Combobox
          value={state.template}
          onChange={value => {
            if (value) onTemplateChange(value)
          }}
          isDisabled={state.isGenerating}
          options={[...TEMPLATE_OPTIONS].map(option => ({
            label: option,
            value: option,
          }))}
          width={200}
        />
      </div>

      <div className="h-4" />

      <JSONEditor
        readOnly={state.isGenerating}
        content={state.content}
        onChange={content => dispatch({ type: 'setContent', payload: content })}
        statusBar={false}
        onRenderMenu={(items, _context) =>
          items.filter(item => ('text' in item ? item.text !== 'table' : true))
        }
      />

      {state.errors.length > 0 && (
        <ul className="my-4">
          {state.errors.map(validationError => (
            <li key={validationError} className="text-red-500">
              {validationError}
            </li>
          ))}
        </ul>
      )}

      <div className="h-6" />

      <p className="text-sm font-semibold">Preview</p>

      <div className="h-4" />

      <div className="preview">{state.sampleCode}</div>

      <div className="h-6" />

      <div className="flex justify-end gap-6">
        <Button type="button" onClick={onPreviewClick}>
          <span>Preview</span>
        </Button>

        {state.step === 2 && (
          <Button
            type="button"
            rightIcon={<ArrowDownIcon />}
            onClick={onStartGenerationClick}
          >
            Start Generating!
          </Button>
        )}
      </div>
    </div>
  )
}
