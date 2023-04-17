import { FormEvent, ReactNode, useState } from 'react'

import { destinations } from '@/lib/constants'
import useGeneratorConfig from '@/lib/hooks/useGeneratorConfig'
import { Helpers } from '@/lib/hooks/useStep'

import DestinationButton from '../DestinationButton'
import { ArrowDownIcon } from '../Icons'
import Layout from '../Layout'
import TinybirdSettings from '../settings/TinybirdSettings'
import UpstashKafkaSettings from '../settings/UpstashKafkaSettings'

type ConnectStepProps = {
  helpers: Helpers
}

type Destination = (typeof destinations)[number]

export default function ConnectStep({ helpers }: ConnectStepProps) {
  const { onConfigChange, config: generatorConfig } = useGeneratorConfig()
  const [selectedDestination, setSelectedDestination] = useState<Destination>(
    destinations[0]
  )
  const [withLimit, setWithLimit] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    const formData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    ) as Record<string, string>
    const { generator } = formData
    const eps = parseInt(formData.eps ?? 1)
    const limit = parseInt(formData.limit ?? -1)

    try {
      const { datasource, token } = formData
      const endpoint =
        formData.host === 'custom' ? formData.endpoint : formData.host

      if (generator === 'Tinybird') {
        onConfigChange(generator, {
          datasource,
          endpoint,
          token,
          eps,
          limit,
        })
      } else if (generator === 'UpstashKafka') {
        const { address, user, pass, topic } = formData
        onConfigChange(generator, {
          address,
          user,
          pass,
          topic,
          eps,
          limit,
        })
      }
      helpers.goToNextStep()
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

  const destinationToSettings: Record<Destination['generator'], ReactNode> = {
    Tinybird: <TinybirdSettings />,
    UpstashKafka: <UpstashKafkaSettings />,
  }

  return (
    <Layout>
      <Layout.LeftCol stepIndex={1} />

      <Layout.RightCol>
        <div className="px-10 pt-8 pb-10 bg-white rounded-lg">
          <h3 className="text-lg font-semibold">Settings</h3>

          <div className="h-2" />

          <p className="text-sm">
            Configure your project according to your destination data
          </p>

          <div className="h-6" />

          <div className="grid gap-4 md:grid-cols-2">
            {destinations.map(destination => (
              <DestinationButton
                key={destination.title}
                isSelected={
                  selectedDestination.generator === destination.generator
                }
                onClick={() => (
                  setErrors([]), setSelectedDestination(destination)
                )}
              >
                <img src={destination.icon} alt={destination.title} />
                {destination.title}
              </DestinationButton>
            ))}
          </div>

          <div className="h-6" />

          <form onSubmit={onSubmit}>
            {destinationToSettings[selectedDestination.generator]}

            <div className="h-6" />

            <div className="grid md:grid-cols-[auto_auto_auto] gap-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="eps" className="text-sm text-tb-text1">
                  Events Per Second
                </label>
                <input
                  id="eps"
                  name="eps"
                  defaultValue={
                    'eps' in generatorConfig ? generatorConfig.eps : 1
                  }
                  type="number"
                  className="input-base md:w-[140px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="limit" className="text-sm text-tb-text1">
                  Limit
                </label>
                <div className="flex items-center h-10 gap-2">
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

                  <div className="w-4" />

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

                  {withLimit && (
                    <>
                      <div className="w-4" />

                      <input
                        id="limit"
                        name="limit"
                        defaultValue={
                          'limit' in generatorConfig
                            ? generatorConfig.limit
                            : -1
                        }
                        type="number"
                        className="input-base md:w-[140px]"
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
                Continue
                <ArrowDownIcon />
              </button>
            </div>
          </form>
        </div>
      </Layout.RightCol>
    </Layout>
  )
}
