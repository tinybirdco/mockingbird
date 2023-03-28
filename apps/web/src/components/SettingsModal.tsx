import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'

import Modal from '@/components/Modal'
import { initializeGenerator } from '@tinybirdco/mockingbird'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
}

const ENDPOINT_OPTIONS = [
  { label: 'EU (GCP)', value: 'eu_gcp' },
  { label: 'US (GCP)', value: 'us_gcp' },
] as const

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const router = useRouter()
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    const values = new FormData(e.target as HTMLFormElement)
    const { datasource, token, host, eps } = Object.fromEntries(values)

    const isValid = initializeGenerator(
      { datasource, endpoint: host, token },
      true
    )

    if (isValid) {
      const urlParams = new URLSearchParams({
        ...router.query,
        host: host.toString(),
        token: token.toString(),
        datasource: datasource.toString(),
        eps: eps.toString(),
      })
      router.push(`?${urlParams}`)
      onClose()
    } else {
      setError('Invalid configuration')
    }
  }

  const host = (router.query.host as string | undefined) ?? '',
    token = (router.query.token as string | undefined) ?? '',
    datasource = (router.query.datasource as string | undefined) ?? '',
    eps = parseInt((router.query.eps as string | undefined) ?? '1')

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <Modal.Title>Settings</Modal.Title>
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-2 items-center justify-between gap-6"
        >
          <label htmlFor="datasource">Data Source</label>
          <input
            id="datasource"
            name="datasource"
            defaultValue={datasource}
            className="input-base"
          />

          <label htmlFor="token">API Token</label>
          <input
            id="token"
            name="token"
            defaultValue={token}
            className="input-base"
          />

          <label htmlFor="host">Host</label>
          <select
            id="host"
            name="host"
            defaultValue={host}
            className="input-base"
          >
            {ENDPOINT_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <label htmlFor="eps">EPS</label>
          <input
            id="eps"
            name="eps"
            defaultValue={eps}
            type="number"
            className="input-base"
          />

          {error.length > 0 && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="btn-base bg-tb_emerald text-white col-span-2"
          >
            Save
          </button>
        </form>
      </Modal.Content>
    </Modal>
  )
}
