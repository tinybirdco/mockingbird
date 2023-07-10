import { cx } from '@/lib/utils'

type StepNameProps = {
  stepNumber: number
  title: string
  isActive?: boolean
}

export default function StepTitle({
  stepNumber,
  title,
  isActive,
}: StepNameProps) {
  return (
    <div key={title} className="flex items-center gap-2">
      <div
        className={cx(
          'flex w-4 h-4 rounded-full items-center justify-center font-medium text-[11px] leading-4 tracking-[1px] uppercase',
          isActive
            ? 'bg-tb-primary'
            : 'border border-solid border-tb-neutral-40 text-tb-neutral-40'
        )}
      >
        {stepNumber}
      </div>
      <p
        className={cx(
          'text-lg font-semibold',
          !isActive && 'text-tb-neutral-40'
        )}
      >
        {title}
      </p>
    </div>
  )
}
