import { Dispatch } from 'react'

import { Action, State } from '@/lib/state'

type OverviewStepProps = {
  state: State
  dispatch: Dispatch<Action>
}

export default function OverviewStep({ state, dispatch }: OverviewStepProps) {
  const overviewItems = [
    ...(state.config
      ? [
          {
            title: 'Events Per Seconds',
            value: state.config.eps,
          },
          {
            title: 'Limit',
            value: state.config.limit,
          },
        ]
      : []),
    ...(state.config && 'datasource' in state.config
      ? [
          {
            title: 'Destination',
            value: 'Tinybird Events API',
          },
          {
            title: 'Data Source',
            value: state.config.datasource,
          },
        ]
      : state.config && 'topic' in state.config
      ? [
          {
            title: 'Destination',
            value: 'Upstash Kafka',
          },
          {
            title: 'Topic',
            value: state.config.topic,
          },
        ]
      : []),
  ] as { title: string; value: string | number }[]

  const onStartGenerationClick = () => {
    dispatch({
      type: 'START_GENERATION',
      payload: {
        onMessage: ({ data }) =>
          dispatch({
            type: 'SET_SENT',
            payload: data,
          }),
        onError: console.error,
      },
    })
  }

  const onStopGenerationClick = () => {
    dispatch({ type: 'STOP_GENERATION', payload: null })
  }

  return (
    <div id="overview-step">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-10 bg-white rounded-lg">
          <p className="text-sm">Total Events Sent</p>
          <h2 className="font-semibold text-[64px] leading-[72px]">
            {state.sentMessages.total}
          </h2>
        </div>

        <div className="p-10 bg-white rounded-lg">
          <p className="text-sm">Sent this session</p>
          <h2 className="font-semibold text-[64px] leading-[72px]">
            {state.sentMessages.session}
          </h2>
        </div>

        <div className="flex flex-wrap gap-10 p-10 bg-white rounded-lg lg:col-span-2">
          {overviewItems.map(item => (
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
          onClick={
            !!state.worker ? onStopGenerationClick : onStartGenerationClick
          }
        >
          {!!state.worker ? 'Stop' : 'Start'} Generating!
        </button>
      </div>
    </div>
  )
}
