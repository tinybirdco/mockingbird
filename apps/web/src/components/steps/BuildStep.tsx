import _isEqual from 'lodash.isequal'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Dispatch, useEffect } from 'react'

import { PresetSchemaNameWithCustom, TEMPLATE_OPTIONS } from '@/lib/constants'
import useGeneratorConfig from '@/lib/hooks/useGeneratorConfig'
import { Action, State, reducer } from '@/lib/state'
import { cx } from '@/lib/utils'

import { ArrowDownIcon, CheckmarkIcon } from '../Icons'

const JSONEditor = dynamic(() => import('@/components/JSONEditor'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

type BuildStepProps = {
  state: State
  dispatch: Dispatch<Action>
}

export default function BuildStep({ state, dispatch }: BuildStepProps) {
  const router = useRouter()
  const { generator, config } = useGeneratorConfig()
  const isSaved = Object.keys(state.schema).length > 0

  useEffect(() => {
    if (!router.isReady) return

    const template = router.query.template as string | undefined
    const schema = router.query.schema as string | undefined
    dispatch({ type: 'setEditorFromQuery', payload: { template, schema } })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const onStartGenerationClick = () => {
    const newState = reducer(state, {
      type: 'setSchema',
      payload: null,
    })
    dispatch({
      type: 'setSchemaAndStartGenerating',
      payload: {
        newState,
        generator,
        config,
        onMessage: ({ data }) =>
          dispatch({
            type: 'setSentMessages',
            payload: data,
          }),
        onError: e => console.error(e),
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
          onChange={e =>
            dispatch({
              type: 'setTemplate',
              payload: e.target.value as PresetSchemaNameWithCustom,
            })
          }
          disabled={state.isGenerating}
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
        <button
          className={cx(
            'py-[10px] px-[14px] flex items-center gap-4 bg-tb-primary rounded-[4px] shadow-[0px_1px_3px_rgba(11,19,36,0.1)] text-sm text-white tracking-[-0.01em] hover:scale-105',
            isSaved && 'bg-opacity-40 cursor-not-allowed'
          )}
          disabled={isSaved}
          onClick={() => dispatch({ type: 'setSchema', payload: null })}
        >
          <span>{isSaved ? 'Saved' : 'Save'}</span>
          {isSaved && <CheckmarkIcon />}
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
