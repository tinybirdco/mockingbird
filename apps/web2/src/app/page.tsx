"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DestinationPicker } from "@/components/destination/destination-picker";
import { ConfigForm } from "@/components/destination/config-form";
import { SchemaEditor } from "@/components/schema/schema-editor";
import { validateStepState, type Step } from "@/lib/navigation";

const stepComponents: Record<Step, React.ComponentType<any>> = {
  destination: DestinationPicker,
  config: ConfigForm,
  schema: SchemaEditor,
  generate: () => <div>Generate Step</div>, // Placeholder for now
};

export default function Home() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("destination");
  
  useEffect(() => {
    const { currentStep } = validateStepState(searchParams);
    setStep(currentStep);
  }, [searchParams]);

  const StepComponent = stepComponents[step];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6">
        <StepComponent />
      </div>
    </div>
  );
}
