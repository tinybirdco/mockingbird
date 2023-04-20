import { State } from '@/lib/state'

import { steps } from '../../lib/constants'
import { ArrowDownIcon } from '../Icons'
import StepTitle from '../StepTitle'

type LandingProps = {
  state: State
  goToNextStep: () => void
}

export default function Landing({ state, goToNextStep }: LandingProps) {
  return (
    <div>
      <h1 className="font-semibold text-[64px] leading-[68px] -tracking-wide">
        <span className="font-bold font-ia-writer">Generate</span> mock{' '}
        <span className="font-bold font-ia-writer">data</span> streams for your
        next data <span className="font-bold font-ia-writer">project.</span>
      </h1>

      <div className="h-[120px]" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col gap-4">
            <StepTitle stepNumber={index + 1} title={step.title} isActive />
            <p className="text-sm">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="h-10" />

      {state.step === 0 && (
        <div className="flex justify-end">
          <button
            className="btn-base btn-primary"
            onClick={() => goToNextStep()}
          >
            Start generating data
            <ArrowDownIcon />
          </button>
        </div>
      )}
    </div>
  )
}
