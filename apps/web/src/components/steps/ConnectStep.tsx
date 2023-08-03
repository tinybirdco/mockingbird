import { Dispatch, FormEvent, useState } from 'react'

import {
  destinations,
  MockingbirdGeneratorName,
  nameToConfigItems,
} from '@/lib/constants'
import { Action, State } from '@/lib/state'

import DestinationButton from '../DestinationButton'
import { ArrowDownIcon } from '../Icons'
import BasicSettings from '../settings/BasicSettings'
import TinybirdSettings from '../settings/TinybirdSettings'

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
    const generator = formData.generator as MockingbirdGeneratorName
    const eps = parseInt(formData.eps ?? '1')
    const limit = parseInt(formData.limit ?? '-1')

    try {
      const endpoint =
        formData.host === 'custom' ? formData.endpoint : formData.host

      if (generator === 'Tinybird') {
        dispatch({
          type: 'SET_CONFIG',
          payload: {
            generatorName: generator,
            config: {
              ...formData,
              endpoint,
              eps,
              limit,
            },
          },
        })
      } else {
        dispatch({
          type: 'SET_CONFIG',
          payload: {
            generatorName: generator,
            config: { ...formData, eps, limit },
          },
        })
      }
      dispatch({ type: 'INCREMENT_STEP', payload: null })
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

  return (
    <div id="connect-step" className="px-10 pt-8 pb-10 bg-white rounded-lg">
      <h3 className="text-lg font-semibold">Settings</h3>

      <div className="h-2" />

      <p className="text-sm">
        Configure your project according to your destination data
      </p>

      <div className="h-6" />

      <fieldset disabled={!!state.worker}>
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
                className="w-8 h-8 max-w-[32px] max-h-8"
              />
              {destination.title}
            </DestinationButton>
          ))}
        </div>

        <div className="h-6" />

        <form onSubmit={onSubmit}>
          {selectedDestination.generator === 'Tinybird' ? (
            <TinybirdSettings config={state.config} />
          ) : (
            <BasicSettings
              config={state.config}
              items={nameToConfigItems[selectedDestination.generator]}
            />
          )}

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
