import { ConfluentCloudKafkaConfig } from '@tinybirdco/mockingbird'

type ConfluentCloudKafkaSettingsProps = {
  config: ConfluentCloudKafkaConfig
}

export default function ConfluentCloudKafkaSettings({
  config: { apiKey, apiSecret, restEndpoint, clusterId, topic },
}: ConfluentCloudKafkaSettingsProps) {
  return (
    <>
      <div className="grid lg:grid-cols-[140px_288px_auto] gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm text-tb-text1">
            REST Endpoint
          </label>
          <input
            id="restEndpoint"
            name="restEndpoint"
            required
            type="url"
            defaultValue={restEndpoint}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm text-tb-text1">
            Cluster ID
          </label>
          <input
            id="clusterId"
            name="clusterId"
            required
            defaultValue={clusterId}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm text-tb-text1">
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

        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm text-tb-text1">
            API Key
          </label>
          <input
            id="apiKey"
            name="apiKey"
            required
            defaultValue={apiKey}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="pass" className="text-sm text-tb-text1">
            API Secret
          </label>
          <input
            id="apiSecret"
            name="apiSecret"
            type="password"
            required
            defaultValue={apiSecret}
            className="input-base"
          />
        </div>
      </div>
    </>
  )
}
