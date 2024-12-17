"use client";

import { MapPin, Database, Play, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Step } from "@/lib/navigation";
import Image from "next/image";

const steps = [
  {
    name: "Select Destination",
    step: "destination" as Step,
    icon: MapPin,
  },
  {
    name: "Configure Destination",
    step: "config" as Step,
    icon: Settings,
  },
  {
    name: "Define Schema",
    step: "schema" as Step,
    icon: Database,
  },
  {
    name: "Generate Data",
    step: "generate" as Step,
    icon: Play,
  },
];

interface SidebarProps {
  currentStep: Step;
  onStepChange: (step: Step) => void;
}

export function Sidebar({ currentStep, onStepChange }: SidebarProps) {
  const handleStepClick = (clickedStep: Step, index: number) => {
    const currentIndex = steps.findIndex(s => s.step === currentStep);
    
    // Only allow clicking on current or previous steps
    if (index > currentIndex) return;

    onStepChange(clickedStep);
  };

  return (
    <div className="w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">Mockingbird</h1>
      </div>
      <div className="p-4">
        <div className="relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-[17px] top-[28px] bottom-2 w-px bg-border" />

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.step;
              const isPast = steps.findIndex((s) => s.step === currentStep) > index;
              const isClickable = index <= steps.findIndex(s => s.step === currentStep);

              return (
                <div
                  key={step.step}
                  className={cn(
                    "relative flex items-start gap-3 pl-2",
                    (isActive || isPast) && "text-foreground",
                    !isActive && !isPast && "text-muted-foreground",
                    isClickable && "cursor-pointer hover:opacity-80"
                  )}
                  onClick={() => handleStepClick(step.step, index)}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleStepClick(step.step, index);
                    }
                  }}
                >
                  <div
                    className={cn(
                      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-background",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isPast && "border-muted bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium">{step.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
