import { UpstashKafkaConfig } from '@tinybirdco/mockingbird'

type UpstashKafkaSettingsProps = {
  config: UpstashKafkaConfig
}

export default function UpstashKafkaSettings({
  config: { address, user, pass, topic },
}: UpstashKafkaSettingsProps) {
  return (
    <>
      <div className="grid lg:grid-cols-[140px_288px_auto] gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm text-tb-text1">
            REST URL
          </label>
          <input
            id="address"
            name="address"
            required
            type="url"
            defaultValue={address}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="user" className="text-sm text-tb-text1">
            REST Username
          </label>
          <input
            id="user"
            name="user"
            required
            defaultValue={user}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="pass" className="text-sm text-tb-text1">
            REST Password
          </label>
          <input
            id="pass"
            name="pass"
            type="password"
            required
            defaultValue={pass}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="topic" className="text-sm text-tb-text1">
            Topic
          </label>
          <input
            id="topic"
            name="topic"
            required
            defaultValue={topic}
            className="input-base"
          />
        </div>
      </div>
    </>
  )
}
