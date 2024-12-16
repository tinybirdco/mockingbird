"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { tinybirdConfigItems, ablyConfigItems, awsSnsConfigItems } from "@/lib/constants";
import { isAblyConfig, isAWSSNSConfig, isTinybirdConfig } from "@/lib/navigation";

interface ConfigItem {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
}

interface ConfigFormProps {
  items?: ConfigItem[];
}

const configItemsByDestination = {
  tinybird: tinybirdConfigItems,
  ably: ablyConfigItems,
  awssns: awsSnsConfigItems,
};

export function ConfigForm({ items: propItems }: ConfigFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const configStr = searchParams.get("config");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Try to parse existing config
  let existingConfig: Record<string, string> = {};
  try {
    if (configStr) {
      existingConfig = JSON.parse(configStr);
    }
  } catch (e) {
    // Invalid config JSON
  }

  // Get items based on selected destination if not provided
  const items = propItems || (destination ? configItemsByDestination[destination as keyof typeof configItemsByDestination] : []);

  const validateConfig = (config: Record<string, string>): boolean => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    // Check for empty required fields
    items.forEach((item) => {
      const value = config[item.id];
      if (item.required && (!value || value.trim() === "")) {
        newErrors[item.id] = "This field is required";
        hasErrors = true;
      }
    });

    // Validate config structure based on destination type
    if (!hasErrors && destination) {
      let isValidConfig = false;
      const destinationType = destination.toLowerCase();

      switch (destinationType) {
        case 'ably':
          isValidConfig = isAblyConfig(config);
          break;
        case 'awssns':
          isValidConfig = isAWSSNSConfig(config);
          break;
        case 'tinybird':
          isValidConfig = isTinybirdConfig(config);
          break;
        default:
          isValidConfig = false;
      }

      if (!isValidConfig) {
        setFormError("Invalid configuration for selected destination");
        hasErrors = true;
      } else {
        setFormError(null);
      }
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const config: Record<string, string> = {};
    
    items.forEach((item) => {
      const value = formData.get(item.id);
      if (value) {
        config[item.id] = value.toString();
      }
    });

    if (validateConfig(config)) {
      const params = new URLSearchParams(searchParams);
      params.set("config", JSON.stringify(config));
      router.replace(`/?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id}>
              <Label htmlFor={item.id}>
                {item.label}
                {item.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={item.id}
                name={item.id}
                type={item.type || "text"}
                defaultValue={existingConfig[item.id] || ""}
                required={item.required}
                className={`mt-1.5 ${errors[item.id] ? 'border-red-500' : ''}`}
                aria-invalid={errors[item.id] ? "true" : "false"}
                aria-describedby={errors[item.id] ? `${item.id}-error` : undefined}
              />
              {errors[item.id] && (
                <p className="text-sm text-red-500 mt-1" id={`${item.id}-error`}>
                  {errors[item.id]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => {
            const params = new URLSearchParams();
            router.replace("/");
          }}>
            Back
          </Button>
          <Button type="submit">Save Configuration</Button>
        </div>
      </Card>
    </form>
  );
}
