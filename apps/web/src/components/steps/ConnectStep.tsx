import { Dispatch, FormEvent, ReactNode, useState } from 'react'

import { destinations } from '@/lib/constants'
import { Action, State } from '@/lib/state'
import {
  AWSSNSConfig,
  AblyConfig,
  ConfluentCloudKafkaConfig,
  TinybirdConfig,
  UpstashKafkaConfig,
} from '@tinybirdco/mockingbird'

import DestinationButton from '../DestinationButton'
import { ArrowDownIcon } from '../Icons'
import TinybirdSettings from '../settings/TinybirdSettings'
import UpstashKafkaSettings from '../settings/UpstashKafkaSettings'
import AblySettings from '../settings/AblySettings'
import ConfluentCloudKafkaSettings from '../settings/ConfluentCloudKafkaSettings'
import AWSSNSSettings from '../settings/AWSSNSSettings'

type ConnectStepProps = {
  state: State
  dispatch: Dispatch<Action>
}

type Destination = (typeof destinations)[number]

export default function ConnectStep({ state, dispatch }: ConnectStepProps) {
  const [selectedDestination, setSelectedDestination] = useState<Destination>(
    destinations[0]
  )
  const [withLimit, setWithLimit] = useState(
    Boolean(state.config && 'limit' in state.config && state.config.limit > 0)
  )
  const [errors, setErrors] = useState<string[]>([])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    const formData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    ) as Record<string, string>
    const { generator } = formData
    const eps = parseInt(formData.eps ?? '1')
    const limit = parseInt(formData.limit ?? '-1')

    try {
      const { datasource, token } = formData as Record<string, string>
      const endpoint =
        formData.host === 'custom' ? formData.endpoint : formData.host

      if (generator === 'Tinybird') {
        dispatch({
          type: 'setConfig',
          payload: {
            generator: 'Tinybird',
            config: {
              datasource,
              endpoint,
              token,
              eps,
              limit,
            },
          },
        })
      } else if (generator === 'UpstashKafka') {
        const { address, user, pass, topic } = formData as Record<
          string,
          string
        >
        dispatch({
          type: 'setConfig',
          payload: {
            generator: 'UpstashKafka',
            config: {
              address,
              user,
              pass,
              topic,
              eps,
              limit,
            },
          },
        })
      } else if (generator === 'Ably') {
        const { apiKey, channelId } = formData as Record<string, string>
        dispatch({
          type: 'setConfig',
          payload: {
            generator: 'Ably',
            config: {
              apiKey,
              channelId,
              eps,
              limit,
            },
          },
        })
      } else if (generator === 'AWSSNS') {
        const { accessKeyId, secretAccessKey, topicArn, region } = formData as Record<
          string,
          string
        >
        dispatch({
          type: 'setConfig',
          payload: {
            generator: 'AWSSNS',
            config: {
              accessKeyId,
              secretAccessKey,
              topicArn,
              region,
              eps,
              limit,
            },
          },
        })
      } else if (generator === 'ConfluentCloudKafka') {
        const { apiKey, apiSecret, restEndpoint, clusterId, topic } =
          formData as Record<string, string>
        dispatch({
          type: 'setConfig',
          payload: {
            generator: 'ConfluentCloudKafka',
            config: {
              apiKey,
              apiSecret,
              restEndpoint,
              clusterId,
              topic,
              eps,
              limit,
            },
          },
        })
      }
      dispatch({ type: 'goToNextStep', payload: null })
    } catch (e) {
      const formatted = (e as any).format()
      console.error(formatted)
      setErrors(
        Object.entries(formatted).map(([key, value]) =>
          value && typeof value === 'object' && '_errors' in value
            ? `${key}: ${value._errors}`
            : ''
        )
      )
    }
  }

  const onDestinationChange = (destination: Destination) => {
    setErrors([])
    setSelectedDestination(destination)
  }

  const destinationToSettings: Record<Destination['generator'], ReactNode> = {
    Tinybird: (
      <TinybirdSettings
        config={(state.config ? state.config : {}) as TinybirdConfig}
      />
    ),
    UpstashKafka: (
      <UpstashKafkaSettings
        config={(state.config ? state.config : {}) as UpstashKafkaConfig}
      />
    ),
    Ably: (
      <AblySettings config={(state.config ? state.config : {}) as AblyConfig} />
    ),
    ConfluentCloudKafka: (
      <ConfluentCloudKafkaSettings
        config={(state.config ? state.config : {}) as ConfluentCloudKafkaConfig}
      />
    ),
    AWSSNS: (
      <AWSSNSSettings
        config={(state.config ? state.config : {}) as AWSSNSConfig}
      />
    ),
  }

  return (
    <div id="connect-step" className="px-10 pt-8 pb-10 bg-white rounded-lg">
      <h3 className="text-lg font-semibold">Settings</h3>

      <div className="h-2" />

      <p className="text-sm">
        Configure your project according to your destination data
      </p>

      <div className="h-6" />

      <fieldset disabled={state.isGenerating}>
        <div className="grid gap-4 lg:grid-cols-2">
          {destinations.map(destination => (
            <DestinationButton
              key={destination.title}
              isSelected={
                selectedDestination.generator === destination.generator
              }
              onClick={() => onDestinationChange(destination)}
            >
              <img
                src={destination.icon}
                alt={destination.title}
                width="32"
                height="32"
              />
              {destination.title}
            </DestinationButton>
          ))}
        </div>

        <div className="h-6" />

        <form onSubmit={onSubmit}>
          {destinationToSettings[selectedDestination.generator]}

          <div className="h-6" />

          <div className="grid lg:grid-cols-[140px_288px_auto] gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="eps" className="text-sm text-tb-text1">
                Events Per Second
              </label>
              <input
                id="eps"
                name="eps"
                defaultValue={
                  state.config && 'eps' in state.config ? state.config.eps : 1
                }
                type="number"
                className="input-base"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="limit" className="text-sm text-tb-text1">
                Limit
              </label>
              <div className="flex items-center h-10 gap-2">
                <input
                  type="radio"
                  id="withLimitNo"
                  name="withLimit"
                  checked={!withLimit}
                  onChange={() => setWithLimit(false)}
                />
                <label htmlFor="withLimitNo" className="text-sm">
                  No
                </label>

                <div className="w-4" />

                <input
                  type="radio"
                  id="withLimitYes"
                  name="withLimit"
                  checked={withLimit}
                  onChange={() => setWithLimit(true)}
                />
                <label htmlFor="withLimitYes" className="text-sm">
                  Yes
                </label>

                {withLimit && (
                  <>
                    <div className="w-4" />

                    <input
                      id="limit"
                      name="limit"
                      defaultValue={
                        state.config && 'limit' in state.config
                          ? state.config.limit
                          : -1
                      }
                      type="number"
                      className="input-base lg:w-[140px]"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <input
            type="hidden"
            name="generator"
            value={selectedDestination.generator}
          />
          {errors.length > 0 && (
            <>
              <div className="h-6" />
              {errors.map(error => (
                <div key={error} className="text-sm text-red-500">
                  {error}
                </div>
              ))}
            </>
          )}
          <div className="h-6" />

          <div className="flex justify-end">
            <button type="submit" className="btn-base btn-primary">
              {state.step === 1 ? (
                <>
                  Continue
                  <ArrowDownIcon />
                </>
              ) : (
                <>Save</>
              )}
            </button>
          </div>
        </form>
      </fieldset>
    </div>
  )
}
