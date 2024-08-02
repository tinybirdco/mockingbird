import { useState } from 'react'

import { MockingbirdConfig } from '@/lib/constants'

enum HostType {
  GCP_EU_WEST3 = 'gcp_europe_west3',
  GCP_US_EAST4 = 'gcp_us_east4',
  AWS_EU_CENTRAL_1 = 'aws_eu_central_1',
  AWS_US_EAST_1 = 'aws_us_east_1',
  AWS_US_WEST_2 = 'aws_us_west_2',
  Custom = 'custom',
}

const ENDPOINT_OPTIONS = [
  { label: 'GCP europe-west3', value: HostType.GCP_EU_WEST3 },
  { label: 'GCP us-east4', value: HostType.GCP_US_EAST4 },
  { label: 'AWS eu-central-1', value: HostType.AWS_EU_CENTRAL_1 },
  { label: 'AWS us-east-1', value: HostType.AWS_US_EAST_1},
  { label: 'AWS us-west-2', value: HostType.AWS_US_WEST_2},
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
    ENDPOINT_OPTIONS.find(ep => ep.value === endpoint)?.value ?? HostType.GCP_EU_WEST3

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
