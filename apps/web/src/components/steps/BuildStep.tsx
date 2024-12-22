import { ChangeEvent, Dispatch } from 'react'

import { PresetSchemaNameWithCustom, TEMPLATE_OPTIONS } from '@/lib/constants'
import { Action, State } from '@/lib/state'
import { cx } from '@/lib/utils'

import { ArrowDownIcon } from '../Icons'

import JSONEditor from '@/components/JSONEditor'

type BuildStepProps = {
  state: State
  dispatch: Dispatch<Action>
}

export default function BuildStep({ state, dispatch }: BuildStepProps) {
  const onTemplateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'SET_TEMPLATE',
      payload: e.target.value as PresetSchemaNameWithCustom,
    })
  }

  const onPreviewClick = () => {
    dispatch({ type: 'SET_SCHEMA', payload: null })
  }

  const onStartGenerationClick = () => {
    dispatch({
      type: 'SAVE_AND_GENERATE',
      payload: {
        onMessage: ({ data }) => {
          if (typeof data === 'number') {
            dispatch({
              type: 'SET_SENT',
              payload: data,
            });
          } else if ('error' in data) {
            console.error(data.error);
          }
        },
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

        <select
          className="input-base"
          value={state.template}
          onChange={onTemplateChange}
          disabled={!!state.worker}
        >
          {TEMPLATE_OPTIONS.map(presetSchemaName => (
            <option key={presetSchemaName} value={presetSchemaName}>
              {presetSchemaName}
            </option>
          ))}
        </select>
      </div>

      <div className="h-4" />

      <JSONEditor
        readOnly={!!state.worker}
        content={state.content}
        onChange={content =>
          dispatch({ type: 'SET_CONTENT', payload: content })
        }
        statusBar={false}
        onRenderMenu={(items, _context) =>
          items.filter(item => ('text' in item ? item.text !== 'table' : true))
        }
      />

      {/* {state.errors.length > 0 && (
        <ul className="my-4">
          {state.errors.map(validationError => (
            <li key={validationError} className="text-red-500">
              {validationError}
            </li>
          ))}
        </ul>
      )*/}

      <div className="h-6" />

      <p className="text-sm font-semibold">Preview</p>

      <div className="h-4" />

      <div className="preview">{state.sampleCode}</div>

      <div className="h-6" />

      <div className="flex justify-end gap-6">
        <button
          className={cx(
            'py-[10px] px-[14px] flex items-center gap-4 bg-tb-primary rounded-[4px] shadow-[0px_1px_3px_rgba(11,19,36,0.1)] text-sm text-white tracking-[-0.01em] hover:scale-105'
          )}
          onClick={onPreviewClick}
        >
          <span>Preview</span>
        </button>

        {state.step === 2 && (
          <button
            type="button"
            className="btn-base btn-primary"
            onClick={onStartGenerationClick}
          >
            Start Generating! <ArrowDownIcon />
          </button>
        )}
      </div>
    </div>
  )
}
