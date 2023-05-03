import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useReducer, useRef } from 'react'

import Layout from '@/components/Layout'
import BuildStep from '@/components/steps/BuildStep'
import ConnectStep from '@/components/steps/ConnectStep'
import Landing from '@/components/steps/Landing'
import OverviewStep from '@/components/steps/OverviewStep'
import { initialState, reducer } from '@/lib/state'

export default function Home() {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)
  const endElRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endElRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.step])

  useEffect(() => {
    if (!router.isReady) return

    dispatch({ type: 'setStateFromURLQuery', payload: router.query })
  }, [router.isReady, router.query])

  const stepToComponent = [
    <Landing
      key="landing"
      state={state}
      goToNextStep={() => dispatch({ type: 'goToNextStep', payload: null })}
    />,
    <ConnectStep key="connect" state={state} dispatch={dispatch} />,
    <BuildStep key="build" state={state} dispatch={dispatch} />,
    <OverviewStep key="overview" state={state} dispatch={dispatch} />,
  ] as const

  return (
    <>
      <Head>
        <title>Mockingbird</title>
        <meta name="description" content="Data generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {process.env.NODE_ENV === 'production' && (
        <Script
          defer
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-domain="tinybird.co"
          data-token={process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN}
        />
      )}

      <Layout>
        <Layout.LeftCol stepIndex={state.step} />
        <Layout.RightCol>
          <div className="flex flex-col gap-6">
            {stepToComponent.map(
              (component, index) => index <= state.step && component
            )}
          </div>

          <div ref={endElRef} />
        </Layout.RightCol>
      </Layout>
    </>
  )
}
