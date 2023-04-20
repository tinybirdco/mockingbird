import useGeneratorConfig from '@/lib/hooks/useGeneratorConfig'
import { UpstashKafkaConfig } from '@tinybirdco/mockingbird'

export default function UpstashKafkaSettings() {
  const { address, user, pass, topic } = useGeneratorConfig()
    .config as UpstashKafkaConfig

  return (
    <>
      <div className="grid lg:grid-cols-[140px_288px_auto] gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm text-tb-text1">
            Upstash Address
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
            Upstash Username
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
            Upstash Password
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
            Kafka Topic
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
