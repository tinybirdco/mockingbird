import useGeneratorConfig from '@/lib/hooks/useGeneratorConfig'

import Layout from '../Layout'

type OverviewStepProps = {
  step: number
  sentMessages: {
    total: number
    session: number
  }
  isGenerating: boolean
  onGenerationStopClick: () => void
}

export default function OverviewStep({
  step,
  sentMessages,
  isGenerating,
  onGenerationStopClick,
}: OverviewStepProps) {
  const { generator, config: generatorConfig } = useGeneratorConfig()
  const infoItems = [
    ...(generator
      ? [
          {
            title: 'Events Per Seconds',
            value: generatorConfig.eps,
          },
          {
            title: 'Limit',
            value: generatorConfig.limit,
          },
        ]
      : []),
    ...(generator === 'Tinybird'
      ? [
          {
            title: 'Destination',
            value: 'Tinybird Events API',
          },
          {
            title: 'Data Source',
            value: generatorConfig.datasource,
          },
        ]
      : generator === 'UpstashKafka'
      ? [
          {
            title: 'Destination',
            value: 'Upstash Kafka',
          },
          {
            title: 'Topic',
            value: generatorConfig.topic,
          },
        ]
      : []),
  ] as const

  return (
    <div id="overview-step">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-10 bg-white rounded-lg">
          <p className="text-sm">Total Events Sent</p>
          <h2 className="font-semibold text-[64px] leading-[72px]">
            {sentMessages.total}
          </h2>
        </div>

        <div className="p-10 bg-white rounded-lg">
          <p className="text-sm">Sent this session</p>
          <h2 className="font-semibold text-[64px] leading-[72px]">
            {sentMessages.session}
          </h2>
        </div>

        <div className="flex flex-wrap gap-10 p-10 bg-white rounded-lg lg:col-span-2">
          {infoItems.map(item => (
            <div key={item.title} className="flex flex-col gap-1">
              <p className="text-sm">{item.title}</p>

              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-9" />

      <div className="flex justify-end">
        <button
          type="button"
          className="btn-base btn-primary"
          onClick={onGenerationStopClick}
        >
          {isGenerating ? 'Stop' : 'Start'} Generating!
        </button>
      </div>
    </div>
  )
}
