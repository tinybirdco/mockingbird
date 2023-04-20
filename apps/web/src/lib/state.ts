import _isEqual from 'lodash.isequal'
import router from 'next/router'
import { Content, JSONContent, TextContent } from 'vanilla-jsoneditor'

import {
  PresetSchemaName,
  presetSchemas,
  Schema,
  TinybirdConfig,
  TinybirdGenerator,
  UpstashKafkaConfig,
  validateSchema,
} from '@tinybirdco/mockingbird'

import {
  PresetSchemaNameWithCustom,
  steps,
  TEMPLATE_OPTIONS,
} from './constants'
import { compressJSON, decompressJSON } from './helpers'
import useGeneratorConfig from './hooks/useGeneratorConfig'
import { createWorker, startWorker, stopWorker } from './workerBuilder'

const isJSONContent = (content: Content): content is JSONContent =>
  'json' in content

export type State = {
  step: number
  schema: Schema
  template: PresetSchemaNameWithCustom
  content: Content
  sampleCode: string
  errors: string[]
  worker: Worker | undefined
  isGenerating: boolean
  sentMessages: {
    total: number
    session: number
  }
}

export type Action =
  | {
      type: 'goToNextStep'
      payload: null
    }
  | {
      type: 'setEditorFromQuery'
      payload: {
        template: string | undefined
        schema: string | undefined
      }
    }
  | {
      type: 'setTemplate'
      payload: PresetSchemaNameWithCustom
    }
  | {
      type: 'setContent'
      payload: Content
    }
  | {
      type: 'setSchema'
      payload: null
    }
  | {
      type: 'setSchemaAndStartGenerating'
      payload: Omit<ReturnType<typeof useGeneratorConfig>, 'onConfigChange'> & {
        onMessage: (message: MessageEvent<number>) => void
        onError: (error: ErrorEvent) => void
        newState: State
      }
    }
  | {
      type: 'startGenerating'
      payload: Omit<ReturnType<typeof useGeneratorConfig>, 'onConfigChange'> & {
        onMessage: (message: MessageEvent<number>) => void
        onError: (error: ErrorEvent) => void
      }
    }
  | {
      type: 'stopGenerating'
      payload: null
    }
  | {
      type: 'setSentMessages'
      payload: number
    }

export const initialState: State = {
  step: 0,
  schema: {},
  template: 'Custom',
  content: { json: '' },
  sampleCode: 'Click Preview to see what your data looks like',
  errors: [],
  worker: undefined,
  isGenerating: false,
  sentMessages: {
    total: 0,
    session: 0,
  },
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'goToNextStep': {
      if (state.step + 1 > steps.length) return state

      return {
        ...state,
        step: state.step + 1,
      }
    }
    case 'setEditorFromQuery': {
      if (
        action.payload.template &&
        TEMPLATE_OPTIONS.includes(action.payload.template as PresetSchemaName)
      ) {
        return {
          ...state,
          template: action.payload.template as PresetSchemaName,
          content: {
            json: presetSchemas[action.payload.template as PresetSchemaName],
          } as JSONContent,
        }
      } else if (action.payload.schema && action.payload.schema !== 'Preset') {
        try {
          const json = JSON.parse(decompressJSON(action.payload.schema))

          return {
            ...state,
            template: 'Custom',
            content: { json },
          }
        } catch (e) {
          console.error(e)
          return {
            ...state,
            template: 'Simple Example',
            content: {
              json: presetSchemas['Simple Example'],
            } as JSONContent,
          }
        }
      }

      return {
        ...state,
        template: 'Simple Example',
        content: {
          json: presetSchemas['Simple Example'],
        } as JSONContent,
      }
    }
    case 'setTemplate': {
      return {
        ...state,
        schema: {},
        template: action.payload,
        content:
          action.payload !== 'Custom'
            ? ({ json: presetSchemas[action.payload] } as JSONContent)
            : state.content,
      }
    }
    case 'setContent': {
      let template: PresetSchemaNameWithCustom = state.template
      if (state.template !== 'Custom') {
        try {
          const parsedContent = isJSONContent(action.payload)
            ? (action.payload as JSONContent).json
            : JSON.parse((action.payload as TextContent).text)

          if (!_isEqual(parsedContent, presetSchemas[state.template]))
            template = 'Custom'
        } catch (e) {
          console.error(e)
          template = 'Custom'
        }
      }

      return {
        ...state,
        schema: {},
        template: template,
        content: action.payload,
      }
    }
    case 'setSchema': {
      let errors: string[] = []
      let sampleCode = ''
      let template = state.template
      let schema: Schema = {}

      try {
        schema = (
          isJSONContent(state.content)
            ? (state.content as JSONContent).json
            : JSON.parse((state.content as TextContent).text)
        ) as Schema
        const validation = validateSchema(schema!)
        errors = validation.errors

        if (schema && validation.valid) {
          errors = []
          const rowGenerator = new TinybirdGenerator({
            schema,
            datasource: '',
            endpoint: '',
            token: '',
            eps: 1,
            limit: -1,
          }).createRowGenerator()
          sampleCode = JSON.stringify(rowGenerator.generate(), null, 4)

          if (
            template !== 'Custom' &&
            JSON.stringify(schema, null, 4) !==
              JSON.stringify(presetSchemas[template], null, 4)
          ) {
            template = 'Custom'
          }

          const urlParams = new URLSearchParams({
            ...router.query,
            template,
            schema: template === 'Custom' ? compressJSON(schema) : 'Preset',
          })
          router.push(`?${urlParams}`, undefined, { scroll: false })
        }
      } catch (e) {
        console.error(e)
        errors = [(e as Error).toString()]
        sampleCode = 'Save to start generating'
      }
      return {
        ...state,
        schema,
        template,
        sampleCode,
        errors,
      }
    }
    case 'setSchemaAndStartGenerating': {
      if (state.worker) return state

      const isSaved = Object.keys(action.payload.newState.schema).length > 0

      if (
        !isSaved ||
        !action.payload.generator ||
        Object.keys(action.payload.config).length === 0
      )
        return action.payload.newState

      const createdWorker = createWorker(
        action.payload.generator,
        {
          ...(action.payload.config as TinybirdConfig | UpstashKafkaConfig),
          schema: action.payload.newState.schema,
        },
        action.payload.onMessage,
        action.payload.onError
      )

      if (!createdWorker) return action.payload.newState

      startWorker(createdWorker)

      return {
        ...action.payload.newState,
        step: action.payload.newState.step + 1,
        worker: createdWorker,
        isGenerating: true,
        sentMessages: {
          total: action.payload.newState.sentMessages.total,
          session: 0,
        },
      }
    }
    case 'startGenerating': {
      if (state.worker) return state

      const isSaved = Object.keys(state.schema).length > 0

      if (
        !isSaved ||
        !action.payload.generator ||
        Object.keys(action.payload.config).length === 0
      )
        return state

      const createdWorker = createWorker(
        action.payload.generator,
        {
          ...(action.payload.config as TinybirdConfig | UpstashKafkaConfig),
          schema: state.schema,
        },
        action.payload.onMessage,
        action.payload.onError
      )

      if (!createdWorker) return state

      startWorker(createdWorker)

      return {
        ...state,
        worker: createdWorker,
        isGenerating: true,
        sentMessages: {
          total: state.sentMessages.total,
          session: 0,
        },
      }
    }
    case 'stopGenerating': {
      if (!state.worker) return state

      stopWorker(state.worker)

      return {
        ...state,
        worker: undefined,
        isGenerating: false,
      }
    }
    case 'setSentMessages': {
      return {
        ...state,
        sentMessages: {
          total: state.sentMessages.total + action.payload,
          session: state.sentMessages.session + action.payload,
        },
      }
    }
    default:
      return state
  }
}
