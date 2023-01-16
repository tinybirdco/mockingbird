import fetch from "cross-fetch";
import { z } from "zod";
import { ALL_TINYBIRD_ENDPOINTS, TinybirdEndpointType } from "./types";

const endpoints: Record<TinybirdEndpointType, string> = {
  eu_gcp: "https://api.tinybird.co",
  us_gcp: "https://api.us-east.tinybird.co",
};

const events_path = "/v0/events";

const configSchema = z.object({
  endpoint: z.string(),
  datasource: z.string(),
  token: z.string(),
});

type TinybirdConfig = z.infer<typeof configSchema>;

let config: TinybirdConfig;

export function validateConfig(cfg: Record<string, unknown>) {
  return configSchema.parse(cfg);
}

export function setConfig(cfg: Record<string, unknown>) {
  config = validateConfig(cfg);
}

export async function sendData(data: object[]) {
  const { endpoint, datasource, token } = config;

  const params = { name: datasource };
  const endpointURL = ALL_TINYBIRD_ENDPOINTS.includes(endpoint)
    ? endpoints[endpoint as TinybirdEndpointType]
    : endpoint;
  const url = new URL(`${endpointURL}${events_path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: data.map((d) => JSON.stringify(d)).join("\n"),
  })
    .then((res) => res.json())
    .then(console.log)
    .catch(console.log);
}
