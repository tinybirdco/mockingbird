import { InputHTMLAttributes } from 'react'

type BasicSettingsProps = {
  config: Record<string, unknown> | null
  items: Array<
    {
      id: string
      label: string
    } & InputHTMLAttributes<HTMLInputElement>
  >
}

export default function BasicSettings({ config, items }: BasicSettingsProps) {
  return (
    <>
      <div className="grid lg:grid-cols-[140px_288px_auto] gap-6">
        {items.map(({ id, label, ...props }) => (
          <div key={id} className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm text-tb-text1">
              {label}
            </label>
            <input
              id={id}
              name={id}
              defaultValue={
                config &&
                id in config &&
                (typeof config[id] === 'string' ||
                  typeof config[id] === 'number')
                  ? (config[id] as string | number)
                  : undefined
              }
              className="input-base"
              {...props}
            />
          </div>
        ))}
      </div>
    </>
  )
}
