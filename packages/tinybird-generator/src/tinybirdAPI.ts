import fetch from "cross-fetch";
import { config } from "./config";
import { ALL_TINYBIRD_ENDPOINTS, TinybirdEndpointType } from "./types";

const endpoints: Record<TinybirdEndpointType, string> = {
  eu_gcp: "https://api.tinybird.co",
  us_gcp: "https://api.us-east.tinybird.co",
};

const events_path = "/v0/events";

export async function sendData(data: object[]) {
  const params = { name: config.datasource };
  const endpointURL = ALL_TINYBIRD_ENDPOINTS.includes(config.endpoint)
    ? endpoints[config.endpoint as TinybirdEndpointType]
    : config.endpoint;
  const url = new URL(`${endpointURL}${events_path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
    method: "POST",
    body: data.map((d) => JSON.stringify(d)).join("\n"),
  })
    .then((res) => res.json())
    .then(console.log)
    .catch(console.log);
}
