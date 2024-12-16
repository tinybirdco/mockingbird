import { ReadonlyURLSearchParams } from "next/navigation";
import { destinations } from "./constants";
import type { AWSSNSConfig, AblyConfig, TinybirdConfig } from '@tinybirdco/mockingbird/client';

export type Step = "destination" | "config" | "schema" | "generate";

export interface StepState {
  currentStep: Step;
  destination: string | null;
  config: Record<string, string> | null;
  schema: Record<string, any> | null;
}

// Type guard functions to validate config objects
export function isAblyConfig(config: Record<string, string>): config is AblyConfig {
  return 'channelId' in config && 'apiKey' in config;
}

export function isAWSSNSConfig(config: Record<string, string>): config is AWSSNSConfig {
  return 'region' in config && 'topicArn' in config && 'accessKeyId' in config && 'secretAccessKey' in config;
}

export function isTinybirdConfig(config: Record<string, string>): config is TinybirdConfig {
  return 'endpoint' in config && 'token' in config && 'datasource' in config;
}

export function validateStepState(
  searchParams: ReadonlyURLSearchParams
): StepState {
  const destination = searchParams.get("destination");
  const configStr = searchParams.get("config");
  const schemaStr = searchParams.get("schema");

  // Validate destination
  const isValidDestination = destinations.some(
    (d) => d.generator.toLowerCase() === destination
  );

  if (!destination || !isValidDestination) {
    return {
      currentStep: "destination",
      destination: null,
      config: null,
      schema: null,
    };
  }

  // Validate config
  let config: Record<string, string> | null = null;
  if (configStr) {
    try {
      const parsedConfig = JSON.parse(configStr);
      
      // First check if all values are non-empty strings
      const hasNonEmptyValues = Object.values(parsedConfig).every(
        (value) => value && value.trim() !== ""
      );

      if (!hasNonEmptyValues) {
        config = null;
      } else {
        // Then validate against the expected config type
        const destinationType = destination.toLowerCase();
        let isValidConfig = false;

        switch (destinationType) {
          case 'ably':
            isValidConfig = isAblyConfig(parsedConfig);
            break;
          case 'awssns':
            isValidConfig = isAWSSNSConfig(parsedConfig);
            break;
          case 'tinybird':
            isValidConfig = isTinybirdConfig(parsedConfig);
            break;
          default:
            isValidConfig = false;
        }

        config = isValidConfig ? parsedConfig : null;
      }
    } catch (e) {
      config = null;
    }
  }

  if (!config) {
    return {
      currentStep: "config",
      destination,
      config: null,
      schema: null,
    };
  }

  // Validate schema
  let schema: Record<string, any> | null = null;
  if (schemaStr) {
    try {
      schema = JSON.parse(schemaStr);
      // Add any specific schema validation here if needed
    } catch (e) {
      schema = null;
    }
  }

  if (!schema) {
    return {
      currentStep: "schema",
      destination,
      config,
      schema: null,
    };
  }

  // All steps are valid
  return {
    currentStep: "generate",
    destination,
    config,
    schema,
  };
}
