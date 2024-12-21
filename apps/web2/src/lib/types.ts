import { z } from "zod";
import type {
  AWSSNSConfig,
  AblyConfig,
  TinybirdConfig,
} from "@tinybirdco/mockingbird/client";

export type DestinationType = "Tinybird" | "AWSSNS" | "Ably";
export type DestinationConfig = AWSSNSConfig | AblyConfig | TinybirdConfig;

// Validation schemas
export const tinybirdConfigSchema = z.object({
  token: z.string().min(1, "API Token is required"),
  datasource: z.string().min(1, "Datasource Name is required"),
});

export const awsSNSConfigSchema = z.object({
  accessKeyId: z.string().min(1, "Access Key ID is required"),
  secretAccessKey: z.string().min(1, "Secret Access Key is required"),
  region: z.string().min(1, "Region is required"),
  topicArn: z.string().min(1, "Topic ARN is required"),
});

export const ablyConfigSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  channelName: z.string().min(1, "Channel Name is required"),
  eventName: z.string().min(1, "Event Name is required"),
});

// Field configurations
interface ConfigField {
  id: keyof (AWSSNSConfig & AblyConfig & TinybirdConfig);
  label: string;
  type?: string;
  required?: boolean;
}

interface DestinationFields {
  name: string;
  fields: ConfigField[];
  schema: z.ZodObject<any>;
}

export const destinationFields: Record<DestinationType, DestinationFields> = {
  Tinybird: {
    name: "Tinybird",
    fields: [
      {
        id: "token",
        label: "API Token",
        required: true,
      },
      {
        id: "datasource",
        label: "Datasource Name",
        required: true,
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
      },
      {
        id: "secretAccessKey",
        label: "Secret Access Key",
        required: true,
      },
      {
        id: "region",
        label: "Region",
        required: true,
      },
      {
        id: "topicArn",
        label: "Topic ARN",
        required: true,
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
      },
      {
        id: "channelName",
        label: "Channel Name",
        required: true,
      },
      {
        id: "eventName",
        label: "Event Name",
        required: true,
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
  return schema.safeParse(config) as z.SafeParseReturnType<unknown, DestinationConfig>;
}

export function getDestinationFields(destination: DestinationType) {
  return destinationFields[destination];
}
