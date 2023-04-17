import { Helpers } from '@/lib/hooks/useStep'

import { steps } from '../../lib/constants'
import { ArrowDownIcon } from '../Icons'
import Layout from '../Layout'
import StepTitle from '../StepTitle'

type LandingProps = {
  helpers: Helpers
}

export default function Landing({ helpers }: LandingProps) {
  return (
    <div className="bg-[center_-33%] bg-repeat-x bg-contain bg-landing-bg">
      <Layout>
        <Layout.LeftCol stepIndex={0} />

        <Layout.RightCol>
          <h1 className="font-semibold text-[64px] leading-[68px] -tracking-wide">
            <span className="italic font-bold font-ia-writer">Generate</span>{' '}
            synthetic{' '}
            <span className="italic font-bold font-ia-writer">data</span>{' '}
            streams for your next data{' '}
            <span className="italic font-bold font-ia-writer">project.</span>
          </h1>

          <div className="h-[120px]" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-4">
                <StepTitle stepNumber={index + 1} title={step.title} isActive />
                <p className="text-sm">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="h-10" />

          <div className="flex justify-end">
            <button
              className="btn-base btn-primary"
              onClick={() => helpers.goToNextStep()}
            >
              Start generating data
              <ArrowDownIcon />
            </button>
          </div>
        </Layout.RightCol>
      </Layout>
    </div>
  )
}
