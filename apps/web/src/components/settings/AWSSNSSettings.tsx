import { AWSSNSConfig } from '@tinybirdco/mockingbird'

type AWSSNSSettingsProps = {
  config: AWSSNSConfig
}

export default function AWSSNSSettings({
  config: { accessKeyId, secretAccessKey, topicArn },
}: AWSSNSSettingsProps) {
  return (
    <>
      <div className="grid lg:grid-cols-[140px_288px_auto] gap-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm text-tb-text1">
            Topic ARN
          </label>
          <input
            id="topicArn"
            name="topicArn"
            required
            defaultValue={topicArn}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="user" className="text-sm text-tb-text1">
            Access Key
          </label>
          <input
            id="accessKeyId"
            name="accessKeyId"
            required
            defaultValue={accessKeyId}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="pass" className="text-sm text-tb-text1">
            Secret Key
          </label>
          <input
            id="secretAccessKey"
            name="secretAccessKey"
            type="password"
            required
            defaultValue={secretAccessKey}
            className="input-base"
          />
        </div>
      </div>
    </>
  )
}
