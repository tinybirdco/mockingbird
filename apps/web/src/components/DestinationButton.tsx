import { cx } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

type DestinationButtonProps = HTMLAttributes<HTMLButtonElement> & {
  isSelected: boolean
}

const DestinationButton = forwardRef<HTMLButtonElement, DestinationButtonProps>(
  ({ isSelected, ...props }, ref) => {
    return (
      <div
        className={cx(
          'w-full h-full p-[2px] rounded-lg',
          isSelected
            ? 'bg-[linear-gradient(134.9deg,#22CD88_-1.04%,#04BAF5_98.18%)]'
            : 'bg-tb-border1'
        )}
      >
        <button
          ref={ref}
          {...props}
          className={cx(
            'w-full h-full p-6 text-sm font-semibold flex items-center gap-4 rounded-md',
            isSelected ? 'bg-white' : 'bg-tb-bg1'
          )}
        >
          {props.children}
        </button>
      </div>
    )
  }
)
DestinationButton.displayName = 'DestinationButton'

export default DestinationButton
