"use client";

import { Database, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Step } from "@/lib/navigation";
import { useRouter } from "next/navigation";

interface SidebarProps {
  currentStep: Step | null;
}

const steps = [
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

export function Sidebar({ currentStep }: SidebarProps) {
  const router = useRouter();

  const handleStepClick = async (clickedStep: Step) => {
    const searchParams = new URLSearchParams(window.location.search);
    router.push(`/${clickedStep}?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Mockingbird</h1>
      </div>

      <nav className="space-y-1">
        {steps.map(({ name, step, icon: Icon }) => {
          const isActive = step === currentStep;
          return (
            <button
              key={step}
              onClick={() => handleStepClick(step)}
              className={cn(
                "flex items-center w-full px-4 py-2 text-sm rounded-lg",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
