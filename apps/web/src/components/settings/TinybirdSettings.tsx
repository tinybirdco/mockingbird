import { useState } from 'react'

import { MockingbirdConfig } from '@/lib/constants'
import { Combobox, Input, Link } from '@tinybird/ui'

enum HostType {
  EU_GCP = 'eu_gcp',
  US_GCP = 'us_gcp',
  Custom = 'custom',
}

const ENDPOINT_OPTIONS = [
  { label: 'EU (GCP)', value: HostType.EU_GCP },
  { label: 'US (GCP)', value: HostType.US_GCP },
  { label: 'Custom', value: HostType.Custom },
] as const

type TinybirdSettingsProps = {
  config: MockingbirdConfig | null
}

export default function TinybirdSettings({ config }: TinybirdSettingsProps) {
  const endpoint = config && 'endpoint' in config ? config.endpoint : undefined
  const token = config && 'token' in config ? config.token : undefined
  const datasource =
    config && 'datasource' in config ? config.datasource : undefined
  const defaultHost =
    ENDPOINT_OPTIONS.find(ep => ep.value === endpoint)?.value ?? HostType.EU_GCP

  const [selectedHost, setSelectedHost] = useState<HostType>(defaultHost)

  return (
    <>
      <div className="px-8 py-3 rounded flex flex-col lg:flex-row lg:items-center justify-between bg-tb-background-05 font-semibold text-[13px] leading-6 text-tb-darkblue-01">
        <p>
          Don&apos;t have a Tinybird account yet? Sign up for free. No credit
          card needed.
        </p>
        <Link
          as="externalLink"
          href="https://ui.tinybird.co/signup"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sign up
        </Link>
      </div>

      <div className="h-6" />

      <div className="grid lg:grid-cols-[140px_288px_auto] gap-6">
        <input type="hidden" name="host" value={selectedHost} />
        <Combobox
          labelId="host"
          label="Host"
          id="host"
          value={selectedHost}
          onChange={value => {
            if (value) setSelectedHost(value)
          }}
          options={[...ENDPOINT_OPTIONS]}
          variant="block"
        />

        {selectedHost === HostType.Custom && (
          <Input
            labelId="endpoint"
            label="Endpoint"
            id="endpoint"
            name="endpoint"
            required
            defaultValue={
              defaultHost === HostType.Custom ? endpoint : undefined
            }
            variant="block"
          />
        )}

        <Input
          labelId="datasource"
          label="Data Source name"
          id="datasource"
          name="datasource"
          required
          defaultValue={datasource}
          variant="block"
        />

        <Input
          labelId="token"
          label="Data Source API Token"
          id="token"
          name="token"
          type="password"
          required
          defaultValue={token}
          variant="block"
        />
      </div>
    </>
  )
}
