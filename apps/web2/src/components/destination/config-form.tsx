"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { tinybirdConfigItems, ablyConfigItems, awsSnsConfigItems } from "@/lib/constants";
import { useQueryState } from "nuqs";
import { tinybirdConfigSchema, ablyConfigSchema, awsSNSConfigSchema } from "@/lib/navigation";

interface ConfigItem {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
}

interface ConfigFormProps {
  items?: ConfigItem[];
  onComplete?: () => void;
}

const configItemsByDestination = {
  Tinybird: tinybirdConfigItems,
  Ably: ablyConfigItems,
  AWSSNS: awsSnsConfigItems,
} as const;

// Required fields for each destination type
const requiredFields = {
  Ably: ['channelId', 'apiKey'],
  AWSSNS: ['region', 'topicArn', 'accessKeyId', 'secretAccessKey'],
  Tinybird: ['endpoint', 'token', 'datasource']
} as const;

export function ConfigForm({ items: propItems, onComplete }: ConfigFormProps) {
  const [destination] = useQueryState("destination");
  const [config, setConfig] = useQueryState("config", {
    parse: (value) => {
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('Error parsing config:', e);
        return null;
      }
    },
    serialize: (value: Record<string, string> | null) => 
      value ? JSON.stringify(value) : null,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

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
    if (destination) {
      const required = requiredFields[destination as keyof typeof requiredFields] || [];

      // Check each required field
      required.forEach(field => {
        if (!config[field] || config[field].trim() === "") {
          newErrors[field] = `${field} is required for ${destination}`;
          hasErrors = true;
        }
      });

      // Validate using Zod schemas
      try {
        switch (destination) {
          case 'Ably':
            ablyConfigSchema.parse(config);
            break;
          case 'AWSSNS':
            awsSNSConfigSchema.parse(config);
            break;
          case 'Tinybird':
            tinybirdConfigSchema.parse(config);
            break;
          default:
            throw new Error(`Unknown destination: ${destination}`);
        }
      } catch (e) {
        setFormError(`Invalid configuration for ${destination}`);
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    setFormError(hasErrors ? "Please fix the errors above" : null);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const newConfig: Record<string, string> = {};
    
    items.forEach((item) => {
      const value = formData.get(item.id);
      if (value) newConfig[item.id] = value.toString();
    });

    if (validateConfig(newConfig)) {
      await setConfig(newConfig);
      onComplete?.();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id}>
              <Label htmlFor={item.id}>
                {item.label}
                {item.required && <span className="text-destructive"> *</span>}
              </Label>
              <Input
                id={item.id}
                name={item.id}
                type={item.type || "text"}
                className="mt-1.5"
                defaultValue={config?.[item.id] || ""}
              />
              {errors[item.id] && (
                <p className="text-sm text-destructive mt-1">{errors[item.id]}</p>
              )}
            </div>
          ))}
        </div>
        {formError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="mt-4">
          Next
        </Button>
      </Card>
    </form>
  );
}
