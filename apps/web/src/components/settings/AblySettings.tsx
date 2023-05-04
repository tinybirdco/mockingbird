import { AblyConfig } from '@tinybirdco/mockingbird'

type AblySettingsProps = {
  config: AblyConfig
}

export default function AblySettings({
  config: { apiKey, channelId },
}: AblySettingsProps) {
  return (
    <>
      <div className="grid lg:grid-cols-[140px_288px_auto] gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm text-tb-text1">
            Channel ID
          </label>
          <input
            id="channelId"
            name="channelId"
            required
            defaultValue={channelId}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="pass" className="text-sm text-tb-text1">
            API Key
          </label>
          <input
            id="apiKey"
            name="apiKey"
            type="password"
            required
            defaultValue={apiKey}
            className="input-base"
          />
        </div>
      </div>
    </>
  )
}
