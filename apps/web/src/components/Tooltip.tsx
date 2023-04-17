import { Popover, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

type TooltipProps = {
  text: string
  children: React.ReactNode
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [isHover, setIsHover] = useState(false)

  return (
    <Popover
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="relative h-5"
    >
      <Popover.Button>{children}</Popover.Button>
      <Transition show={isHover} as={Fragment}>
        <Popover.Panel className="absolute bottom-6 -right-10 bg-tb-text1 text-white text-xs font-light rounded py-1 px-2 z-[2] w-24">
          {text}
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
