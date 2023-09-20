import _isEqual from 'lodash.isequal'
import router from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { Content, JSONContent, TextContent } from 'vanilla-jsoneditor'

import {
  BaseGenerator,
  presetSchemas,
  Schema,
  validateSchema,
} from '@tinybirdco/mockingbird'

import {
  MockingbirdConfig,
  MockingbirdGeneratorName,
  nameToConfigItems,
  nameToGenerator,
  PresetSchemaNameWithCustom,
  steps,
  TEMPLATE_OPTIONS,
} from './constants'
import { compressJSON, decompressJSON } from './helpers'
import { createWorker, startWorker, stopWorker } from './workerBuilder'

export type State = {
  step: number
  generatorName: MockingbirdGeneratorName | null
  config: MockingbirdConfig | null
  schema: Schema
  template: PresetSchemaNameWithCustom
  content: Content
  sampleCode: string
  errors: string[]
  worker: Worker | null
  sentMessages: {
    total: number
    session: number
  }
}

export type Action =
  | {
      type: 'INCREMENT_STEP'
      payload: null
    }
  | {
      type: 'SET_FROM_QUERY'
      payload: ParsedUrlQuery
    }
  | {
      type: 'SET_CONFIG'
      payload: {
        generatorName: MockingbirdGeneratorName
        config: Record<string, any>
      }
    }
  | {
      type: 'SET_TEMPLATE'
      payload: PresetSchemaNameWithCustom
    }
  | {
      type: 'SET_CONTENT'
      payload: Content
    }
  | {
      type: 'SET_SCHEMA'
      payload: null
    }
  | {
      type: 'SAVE_AND_GENERATE'
      payload: {
        onMessage: (message: MessageEvent<number>) => void
        onError: (error: ErrorEvent) => void
      }
    }
  | {
      type: 'START_GENERATION'
      payload: {
        onMessage: (message: MessageEvent<number>) => void
        onError: (error: ErrorEvent) => void
      }
    }
  | {
      type: 'STOP_GENERATION'
      payload: null
    }
  | {
      type: 'SET_SENT'
      payload: number
    }

export const initialState: State = {
  step: 0,
  generatorName: null,
  config: null,
  schema: {},
  template: 'Custom',
  content: { json: '' },
  sampleCode: 'Click Preview to see what your data looks like',
  errors: [],
  worker: null,
  sentMessages: {
    total: 0,
    session: 0,
  },
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT_STEP': {
      if (state.step + 1 > steps.length) return state

      return {
        ...state,
        step: state.step + 1,
      }
    }
    case 'SET_FROM_QUERY': {
      const { template, content } = handleContentFromURL(router.query)
      const { generatorName, config } = handleConfigFromURL(router.query)

      return {
        ...state,
        generatorName,
        config,
        template,
        content,
        step: generatorName && config ? 2 : 0,
      }
    }
    case 'SET_CONFIG': {
      new nameToGenerator[action.payload.generatorName]({
        ...action.payload.config,
        schema: {} as Schema,
      } as any)

      const urlParams = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(router.query).map(([key, value]) => [
            key,
            value ? value.toString() : '',
          ])
        ),
        ...Object.fromEntries(
          Object.entries(action.payload.config).map(([key, value]) => [
            key,
            value.toString(),
          ])
        ),
        generatorName: action.payload.generatorName,
      })
      router.push(`?${urlParams}`, undefined, { scroll: false })
      return {
        ...state,
        generatorName: action.payload.generatorName,
        config: action.payload.config as MockingbirdConfig,
      }
    }

    case 'SET_TEMPLATE': {
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
    case 'SET_CONTENT': {
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
    case 'SET_SCHEMA': {
      const { schema, template, sampleCode, errors } = parseSchema(
        state.template,
        state.content
      )
      return {
        ...state,
        schema,
        template,
        sampleCode,
        errors,
      }
    }
    case 'SAVE_AND_GENERATE': {
      if (state.worker || !state.generatorName || !state.config) return state

      const { schema, template, sampleCode, errors } = parseSchema(
        state.template,
        state.content
      )

      if (!Object.keys(schema).length) return state

      const createdWorker = createWorker(
        state.generatorName,
        {
          ...(state.config as MockingbirdConfig),
          schema,
        },
        action.payload.onMessage,
        action.payload.onError
      )

      if (!createdWorker) return state

      startWorker(createdWorker)

      return {
        ...state,
        schema,
        template,
        errors,
        step: state.step + 1,
        worker: createdWorker,
        sentMessages: {
          total: 0,
          session: 0,
        },
      }
    }
    case 'START_GENERATION': {
      if (state.worker) return state

      const isSaved = Object.keys(state.schema).length > 0

      if (!isSaved || !state.generatorName || !state.config) return state

      const createdWorker = createWorker(
        state.generatorName,
        {
          ...(state.config as MockingbirdConfig),
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
        sentMessages: {
          total: state.sentMessages.total,
          session: 0,
        },
      }
    }
    case 'STOP_GENERATION': {
      if (!state.worker) return state

      stopWorker(state.worker)

      return {
        ...state,
        worker: null,
      }
    }
    case 'SET_SENT': {
      const isDone =
        state.config &&
        state.config.limit !== -1 &&
        state.sentMessages.session + action.payload >= state.config.limit

      if (state.worker && isDone) stopWorker(state.worker)

      return {
        ...state,
        sentMessages: {
          total: state.sentMessages.total + action.payload,
          session: state.sentMessages.session + action.payload,
        },
        worker: isDone ? null : state.worker,
      }
    }
    default:
      return state
  }
}

const handleContentFromURL = (
  routerQuery: ParsedUrlQuery
): {
  template: PresetSchemaNameWithCustom
  content: JSONContent
} => {
  const queryTemplate = routerQuery.template as
    | PresetSchemaNameWithCustom
    | undefined
  const querySchema = routerQuery.schema as string | undefined

  if (
    queryTemplate &&
    queryTemplate !== 'Custom' &&
    TEMPLATE_OPTIONS.includes(queryTemplate)
  ) {
    return {
      template: queryTemplate,
      content: {
        json: presetSchemas[queryTemplate],
      } as JSONContent,
    }
  } else if (querySchema && querySchema !== 'Preset') {
    try {
      const json = JSON.parse(decompressJSON(querySchema))

      return {
        template: 'Custom',
        content: { json },
      }
    } catch (e) {
      console.error(e)
      return {
        template: 'Simple Example',
        content: {
          json: presetSchemas['Simple Example'],
        } as JSONContent,
      }
    }
  }

  return {
    template: 'Simple Example',
    content: {
      json: presetSchemas['Simple Example'],
    } as JSONContent,
  }
}

const handleConfigFromURL = (routerQuery: ParsedUrlQuery) => {
  const generatorName = router.query.generatorName as
    | MockingbirdGeneratorName
    | undefined

  if (!generatorName) return { generatorName: null, config: null }

  const eps = parseInt((routerQuery.eps as string | undefined) ?? '1')
  const limit = parseInt((routerQuery.limit as string | undefined) ?? '-1')

  const config = nameToConfigItems[generatorName]
    .map(({ id }) => id)
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: (router.query[key] as string | undefined) ?? '',
      }),
      { eps, limit, schema: {} }
    ) as MockingbirdConfig

  return { generatorName, config }
}

const parseSchema = (
  template: PresetSchemaNameWithCustom,
  content: Content
) => {
  let errors: string[] = []
  let sampleCode = ''
  let schema: Schema = {}

  try {
    schema = (
      isJSONContent(content)
        ? (content as JSONContent).json
        : JSON.parse((content as TextContent).text)
    ) as Schema
    const validation = validateSchema(schema!)
    errors = validation.errors

    if (schema && validation.valid) {
      sampleCode = JSON.stringify(
        new BaseGenerator({
          schema,
          eps: 1,
          limit: -1,
        }).generateRow(),
        null,
        4
      )

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
    schema,
    template,
    sampleCode,
    errors,
  }
}

const isJSONContent = (content: Content): content is JSONContent =>
  'json' in content
