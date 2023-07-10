import { ConfigItem } from '@/lib/constants'
import { Input } from '@tinybird/ui'

type BasicSettingsProps = {
  config: Record<string, unknown> | null
  items: ReadonlyArray<ConfigItem>
}

export default function BasicSettings({ config, items }: BasicSettingsProps) {
  return (
    <>
      <div className="grid lg:grid-cols-[140px_288px_auto] gap-6">
        {items.map(({ id, label, ...props }) => (
          <Input
            key={id}
            label={label}
            labelId={id}
            id={id}
            name={id}
            defaultValue={
              config &&
              id in config &&
              (typeof config[id] === 'string' || typeof config[id] === 'number')
                ? (config[id] as string | number)
                : undefined
            }
            variant="block"
            {...props}
          />
        ))}
      </div>
    </>
  )
}
