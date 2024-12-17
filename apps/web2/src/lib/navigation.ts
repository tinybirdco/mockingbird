import { destinations } from "./constants";
import type { AWSSNSConfig, AblyConfig, TinybirdConfig } from '@tinybirdco/mockingbird/client';
import { z } from 'zod';

export type Step = "destination" | "config" | "schema" | "generate";

export interface StepState {
  currentStep: Step;
  destination: string | null;
  config: Record<string, string> | null;
  schema: Record<string, any> | null;
}

// Zod schemas for config validation
export const tinybirdConfigSchema = z.object({
  endpoint: z.string(),
  token: z.string(),
  datasource: z.string(),
});

export const ablyConfigSchema = z.object({
  channelId: z.string(),
  apiKey: z.string(),
});

export const awsSNSConfigSchema = z.object({
  region: z.string(),
  topicArn: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
});

// Type assertions to ensure our Zod schemas match the Mockingbird types
type ZodTinybirdConfig = z.infer<typeof tinybirdConfigSchema>;
type ZodAblyConfig = z.infer<typeof ablyConfigSchema>;
type ZodAWSSNSConfig = z.infer<typeof awsSNSConfigSchema>;

// These will fail at compile time if our Zod schemas don't match the Mockingbird types
const _tinybirdTypeCheck: ZodTinybirdConfig = {} as TinybirdConfig;
const _ablyTypeCheck: ZodAblyConfig = {} as AblyConfig;
const _awsSNSTypeCheck: ZodAWSSNSConfig = {} as AWSSNSConfig;

export function validateStepState(
  destination: string | null,
  config: Record<string, string> | null,
  schema: Record<string, any> | null
): StepState {
  console.log('Validating state:', { destination, config, schema });
  
  // Start with a base state
  const baseState = {
    destination,
    config: null,
    schema: null,
  };

  // Validate destination
  const isValidDestination = destination && destinations.some(
    (d) => d.generator === destination
  );
  console.log('Destination validation:', { destination, isValidDestination });

  if (!destination || !isValidDestination) {
    return {
      ...baseState,
      currentStep: "destination",
    };
  }

  // Validate config
  if (!config) {
    return {
      ...baseState,
      currentStep: "config",
    };
  }

  // Validate config type
  const destinationType = destination;
  let isValidConfig = false;

  try {
    switch (destinationType) {
      case 'Ably':
        ablyConfigSchema.parse(config);
        isValidConfig = true;
        break;
      case 'AWSSNS':
        awsSNSConfigSchema.parse(config);
        isValidConfig = true;
        break;
      case 'Tinybird':
        tinybirdConfigSchema.parse(config);
        isValidConfig = true;
        break;
      default:
        isValidConfig = false;
    }
  } catch (e) {
    console.error('Config validation error:', e);
    isValidConfig = false;
  }
  
  console.log('Config type validation:', { destinationType, isValidConfig });

  if (!isValidConfig) {
    return {
      ...baseState,
      currentStep: "config",
    };
  }

  // At this point, we have a valid config
  const stateWithConfig = {
    ...baseState,
    config,
  };

  // Validate schema
  if (!schema || typeof schema !== 'object') {
    return {
      ...stateWithConfig,
      currentStep: "schema",
    };
  }

  // Check if schema is empty (empty object)
  const isEmptySchema = Object.keys(schema).length === 0;
  console.log('Schema validation:', { schema, isEmptySchema });
  
  if (isEmptySchema) {
    return {
      ...stateWithConfig,
      currentStep: "schema",
      schema: null,
    };
  }

  // If we have a valid schema, we can proceed to generate
  return {
    ...stateWithConfig,
    currentStep: "generate",
    schema,
  };
}
