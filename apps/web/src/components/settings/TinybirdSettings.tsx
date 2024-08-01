import { useState } from 'react'

import { MockingbirdConfig } from '@/lib/constants'

enum HostType {
  EU_GCP = 'eu_gcp',
  US_GCP = 'us_gcp',
  EU_AWS_CENTRAL_1 = 'eu_aws_central_1',
  US_AWS_EAST_1 = 'us_aws_east_1',
  US_AWS_WEST_2 = 'us_aws_east_2',
  Custom = 'custom',
}

const ENDPOINT_OPTIONS = [
  { label: 'EU (GCP)', value: HostType.EU_GCP },
  { label: 'US (GCP)', value: HostType.US_GCP },
  { label: 'EU (AWS)', value: HostType.EU_AWS_CENTRAL_1 },
  { label: 'US EAST (AWS)', value: HostType.US_AWS_EAST_1},
  { label: 'US WEST (AWS)', value: HostType.US_AWS_WEST_2},
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
      <div className="px-8 py-3 rounded flex flex-col lg:flex-row lg:items-center justify-between bg-tb-bg2 font-semibold text-[13px] leading-6 text-tb-text3">
        <p>
          Don&apos;t have a Tinybird account yet? Sign up for free. No credit
          card needed.
        </p>
        <a
          href="https://ui.tinybird.co/signup"
          rel="noopener noreferrer"
          target="_blank"
          className="underline"
        >
          Sign up
        </a>
      </div>

      <div className="h-6" />

      <div className="grid lg:grid-cols-[140px_288px_auto] gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="host" className="text-sm text-tb-text1">
            Host
          </label>
          <select
            id="host"
            name="host"
            className="input-base"
            value={selectedHost}
            onChange={e => setSelectedHost(e.target.value as HostType)}
          >
            {ENDPOINT_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {selectedHost === HostType.Custom && (
          <div className="flex flex-col gap-1">
            <label htmlFor="endpoint" className="text-sm text-tb-text1">
              Endpoint
            </label>
            <input
              id="endpoint"
              name="endpoint"
              required
              defaultValue={
                defaultHost === HostType.Custom ? endpoint : undefined
              }
              className="input-base"
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="datasource" className="text-sm text-tb-text1">
            Data Source name
          </label>
          <input
            id="datasource"
            name="datasource"
            required
            defaultValue={datasource}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="token" className="text-sm text-tb-text1">
            Data Source API Token
          </label>
          <input
            id="token"
            name="token"
            type="password"
            required
            defaultValue={token}
            className="input-base"
          />
        </div>
      </div>
    </>
  )
}
