import { ReactNode } from 'react'

import { steps } from '@/lib/constants'

import StepTitle from './StepTitle'
import useActiveStep from '@/lib/hooks/useActiveStep'

type LayoutProps = {
  children: ReactNode
}

type LeftColProps = {
  stepIndex: number
}

type RightColProps = {
  children: ReactNode
}

function LeftCol({ stepIndex }: LeftColProps) {
  const activeStep = useActiveStep()

  return (
    <div className="lg:sticky flex flex-col lg:col-span-3 gap-4 justify-between top-8 lg:h-[80vh]">
      <div>
        <h2 className="text-[34px] leading-[41px] font-semibold -tracking-wide">
          Mockingbird.
        </h2>
        <h6 className="text-[15px] leading-[18px] font-semibold">
          by tinybird
        </h6>

        {stepIndex > 0 && (
          <>
            <div className="h-10" />

            <div className="flex flex-col gap-2">
              {steps.map((step, index) => {
                const stepContainer = document.getElementById(step.id)

                return (
                  <div
                    key={step.title}
                    onClick={() =>
                      index < stepIndex
                        ? stepContainer?.scrollIntoView({ behavior: 'smooth' })
                        : undefined
                    }
                    className={
                      index < stepIndex ? 'cursor-pointer' : 'cursor-default'
                    }
                  >
                    <StepTitle
                      stepNumber={index + 1}
                      title={step.title}
                      isActive={activeStep === index}
                    />
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {stepIndex > 0 && (
        <h3 className="text-sm font-semibold leading-4 text-tb-text1 -tracking-wide max-w-[152px]">
          <span className="font-bold font-ia-writer">Generate</span> mock{' '}
          <span className="font-bold font-ia-writer">data</span> streams for
          your next data{' '}
          <span className="font-bold font-ia-writer">project.</span>
        </h3>
      )}
    </div>
  )
}

function RightCol({ children }: RightColProps) {
  return <div className="lg:col-span-9">{children}</div>
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-[center_-128px] bg-repeat-x bg-contain bg-landing-bg">
      <div className="max-w-[1072px] mx-auto pt-8 pb-6 px-4 xl:px-0 flex flex-col gap-16">
        <div className="grid flex-1 grid-cols-1 gap-16 lg:grid-cols-12">
          {children}
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-tb-text1">
            Copyright © 2023 Tinybird. All rights reserved
          </p>
          <p className="text-xs text-tb-text1">
            Terms of service | Legal notice
          </p>
        </div>
      </div>
    </div>
  )
}

export default Object.assign(Layout, {
  LeftCol,
  RightCol,
})
