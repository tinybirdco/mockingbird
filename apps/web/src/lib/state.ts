import _isEqual from 'lodash.isequal'
import router from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { Content, JSONContent, TextContent } from 'vanilla-jsoneditor'

import {
  presetSchemas,
  Schema,
  TinybirdConfig,
  TinybirdGenerator,
  UpstashKafkaConfig,
  UpstashKafkaGenerator,
  validateSchema,
} from '@tinybirdco/mockingbird'

import {
  PresetSchemaNameWithCustom,
  steps,
  TEMPLATE_OPTIONS,
} from './constants'
import { compressJSON, decompressJSON } from './helpers'
import { createWorker, startWorker, stopWorker } from './workerBuilder'

export type State = {
  step: number
  generator: 'Tinybird' | 'UpstashKafka' | null
  config:
    | Omit<TinybirdConfig, 'schema'>
    | Omit<UpstashKafkaConfig, 'schema'>
    | null
  schema: Schema
  template: PresetSchemaNameWithCustom
  content: Content
  sampleCode: string
  errors: string[]
  worker: Worker | null
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
      type: 'setStateFromURLQuery'
      payload: ParsedUrlQuery
    }
  | {
      type: 'setConfig'
      payload:
        | {
            generator: 'Tinybird'
            config: Omit<TinybirdConfig, 'schema'>
          }
        | {
            generator: 'UpstashKafka'
            config: Omit<UpstashKafkaConfig, 'schema'>
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
      payload: {
        onMessage: (message: MessageEvent<number>) => void
        onError: (error: ErrorEvent) => void
      }
    }
  | {
      type: 'startGenerating'
      payload: {
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
  generator: null,
  config: null,
  schema: {},
  template: 'Custom',
  content: { json: '' },
  sampleCode: 'Click Preview to see what your data looks like',
  errors: [],
  worker: null,
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
    case 'setStateFromURLQuery': {
      const { template, content } = handleContentFromURL(router.query)
      const { generator, config } = handleConfigFromURL(router.query)

      return {
        ...state,
        generator,
        config,
        template,
        content,
      }
    }
    case 'setConfig': {
      if (action.payload.generator === 'Tinybird') {
        new TinybirdGenerator({
          ...action.payload.config,
          schema: {},
        } as TinybirdConfig)
      } else if (action.payload.generator === 'UpstashKafka') {
        new UpstashKafkaGenerator({
          ...action.payload.config,
          schema: {},
        } as UpstashKafkaConfig)
      }

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
        generator: action.payload.generator,
      })
      router.push(`?${urlParams}`, undefined, { scroll: false })
      return {
        ...state,
        generator: action.payload.generator,
        config: action.payload.config,
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
    case 'setSchemaAndStartGenerating': {
      if (state.worker || !state.generator || !state.config) return state

      const { schema, template, sampleCode, errors } = parseSchema(
        state.template,
        state.content
      )

      if (!Object.keys(schema).length) return state

      const createdWorker = createWorker(
        state.generator,
        {
          ...(state.config as TinybirdConfig | UpstashKafkaConfig),
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
        isGenerating: true,
        sentMessages: {
          total: 0,
          session: 0,
        },
      }
    }
    case 'startGenerating': {
      if (state.worker) return state

      const isSaved = Object.keys(state.schema).length > 0

      if (!isSaved || !state.generator || !state.config) return state

      const createdWorker = createWorker(
        state.generator,
        {
          ...(state.config as TinybirdConfig | UpstashKafkaConfig),
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
        worker: null,
        isGenerating: false,
      }
    }
    case 'setSentMessages': {
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
        isGenerating: !isDone,
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
  const generator = router.query.generator as
    | 'Tinybird'
    | 'UpstashKafka'
    | undefined

  if (generator === 'Tinybird') {
    const config: Omit<TinybirdConfig, 'schema'> = {
      endpoint: (router.query.endpoint as string | undefined) ?? '',
      token: (router.query.token as string | undefined) ?? '',
      datasource: (router.query.datasource as string | undefined) ?? '',
      eps: parseInt((router.query.eps as string | undefined) ?? '1'),
      limit: parseInt((router.query.limit as string | undefined) ?? '-1'),
    }
    return { generator, config }
  } else if (generator === 'UpstashKafka') {
    const config: Omit<UpstashKafkaConfig, 'schema'> = {
      address: (router.query.address as string | undefined) ?? '',
      user: (router.query.user as string | undefined) ?? '',
      pass: (router.query.pass as string | undefined) ?? '',
      topic: (router.query.topic as string | undefined) ?? '',
      eps: parseInt((router.query.eps as string | undefined) ?? '1'),
      limit: parseInt((router.query.limit as string | undefined) ?? '-1'),
    }
    return { generator, config }
  }
  return { generator: null, config: null }
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
    schema,
    template,
    sampleCode,
    errors,
  }
}

const isJSONContent = (content: Content): content is JSONContent =>
  'json' in content
