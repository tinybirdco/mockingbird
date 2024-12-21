import { z } from "zod";
import {
  type AWSSNSConfig,
  type AblyConfig,
  type TinybirdConfig,
} from "@tinybirdco/mockingbird/client";

export type DestinationType = "Tinybird" | "AWSSNS" | "Ably";
export type DestinationConfig = AWSSNSConfig | AblyConfig | TinybirdConfig;

enum tinybirdEndpoints {
  gcp_europe_west3,
  gcp_us_east4,
  aws_us_east_1,
  aws_eu_central_1,
  aws_us_west_2,
}

// Validation schemas
export const tinybirdConfigSchema = z.object({
  token: z.string().min(1, "API Token is required"),
  datasource: z.string().min(1, "Datasource Name is required"),
  endpoint: z.enum(
    Object.keys(tinybirdEndpoints) as [keyof typeof tinybirdEndpoints]
  ),
});

export const awsSNSConfigSchema = z.object({
  accessKeyId: z.string().min(1, "Access Key ID is required"),
  secretAccessKey: z.string().min(1, "Secret Access Key is required"),
  region: z.string().min(1, "Region is required"),
  topicArn: z.string().min(1, "Topic ARN is required"),
});

export const ablyConfigSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  channelId: z.string().min(1, "Channel ID is required"),
});

// Field configurations
interface ConfigField {
  id: keyof (AWSSNSConfig & AblyConfig & TinybirdConfig);
  label: string;
  type?: string;
  required?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
}

interface DestinationFields {
  name: string;
  fields: ConfigField[];
  schema: z.ZodObject<z.ZodRawShape>;
}

export const destinationFields: Record<DestinationType, DestinationFields> = {
  Tinybird: {
    name: "Tinybird",
    fields: [
      {
        id: "token",
        label: "API Token",
        required: true,
        type: "input",
      },
      {
        id: "datasource",
        label: "Datasource Name",
        required: true,
        type: "input",
      },
      {
        id: "endpoint",
        label: "Endpoint",
        required: true,
        type: "select",
        options: [
          { label: "GCP Europe West 3", value: "gcp_europe_west3" },
          { label: "GCP US East 4", value: "gcp_us_east4" },
          { label: "AWS US East 1", value: "aws_us_east_1" },
          { label: "AWS EU Central 1", value: "aws_eu_central_1" },
          { label: "AWS US West 2", value: "aws_us_west_2" },
        ],
      },
    ],
    schema: tinybirdConfigSchema,
  },
  AWSSNS: {
    name: "AWS SNS",
    fields: [
      {
        id: "accessKeyId",
        label: "Access Key ID",
        required: true,
        type: "input",
      },
      {
        id: "secretAccessKey",
        label: "Secret Access Key",
        required: true,
        type: "input",
      },
      {
        id: "region",
        label: "Region",
        required: true,
        type: "input",
      },
      {
        id: "topicArn",
        label: "Topic ARN",
        required: true,
        type: "input",
      },
    ],
    schema: awsSNSConfigSchema,
  },
  Ably: {
    name: "Ably",
    fields: [
      {
        id: "apiKey",
        label: "API Key",
        required: true,
        type: "input",
      },
      {
        id: "channelId",
        label: "Channel Name",
        required: true,
        type: "input",
      },
    ],
    schema: ablyConfigSchema,
  },
};

// Validation helper functions
export function validateDestinationConfig(
  destination: DestinationType,
  config: unknown
): z.SafeParseReturnType<unknown, DestinationConfig> {
  const schema = destinationFields[destination].schema;
  return schema.safeParse(config) as z.SafeParseReturnType<
    unknown,
    DestinationConfig
  >;
}

export function getDestinationFields(destination: DestinationType) {
  return destinationFields[destination];
}
