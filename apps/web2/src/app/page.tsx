"use client";

import { useState, useEffect } from "react";
import { DestinationPicker } from "@/components/destination/destination-picker";
import { ConfigForm } from "@/components/destination/config-form";
import { SchemaEditor } from "@/components/schema/schema-editor";
import { validateStepState, type Step, tinybirdConfigSchema, ablyConfigSchema, awsSNSConfigSchema } from "@/lib/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { useQueryState, parseAsJson } from "nuqs";
import { z } from "zod";

const stepComponents: Record<Step, React.ComponentType<any>> = {
  destination: DestinationPicker,
  config: ConfigForm,
  schema: SchemaEditor,
  generate: () => <div>Generate Step</div>, // Placeholder for now
};

// Schema for any valid config type
const configSchema = z.union([
  tinybirdConfigSchema,
  ablyConfigSchema,
  awsSNSConfigSchema,
]);

// Schema for the mockingbird schema
const schemaSchema = z.record(z.object({
  type: z.string(),
  params: z.any().optional(),
}));

export default function Home() {
  const [step, setStep] = useState<Step>("destination");
  const [prevDestination, setPrevDestination] = useState<string | null>(null);
  
  const [destination] = useQueryState("destination");
  const [config] = useQueryState("config", {
    parse: (value) => {
      if (!value) return null;
      try {
        const parsed = JSON.parse(value);
        console.log('Parsed config:', parsed);
        return parsed;
      } catch (e) {
        console.error('Error parsing config:', e);
        return null;
      }
    }
  });
  const [schema] = useQueryState("schema", {
    parse: (value) => {
      if (!value) return null;
      try {
        const parsed = JSON.parse(value);
        console.log('Parsed schema:', parsed);
        return parsed;
      } catch (e) {
        console.error('Error parsing schema:', e);
        return null;
      }
    }
  });
  
  // Watch for destination changes 
  useEffect(() => {
    if (destination !== prevDestination) {
      setPrevDestination(destination);
    }
  }, [destination, prevDestination]);

  // Validate step state and update current step
  useEffect(() => {
    console.log('Current state:', { destination, config, schema });
    const validatedState = validateStepState(destination, config, schema);
    console.log('Validated state:', validatedState);
    setStep(validatedState.currentStep);
  }, [destination, config, schema]);

  const StepComponent = stepComponents[step];

  return (
    <div className="flex h-full">
      <Sidebar currentStep={step} onStepChange={setStep} />
      <div className="flex-1 p-6">
        <StepComponent />
      </div>
    </div>
  );
}
