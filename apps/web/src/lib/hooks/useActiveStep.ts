import { useEffect, useState } from 'react'

import { steps } from '../constants'
import { isInViewport } from '../utils'

export default function useActiveStep() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    function onScroll() {
      for (let i = steps.length - 1; i >= 0; i--) {
        const stepContainer = document.getElementById(steps[i].id)

        if (stepContainer && isInViewport(stepContainer)) {
          setActiveStep(i)
          break
        }
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return activeStep
}
