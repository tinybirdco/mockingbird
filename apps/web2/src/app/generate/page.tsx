"use client";

import { useState } from "react";
import { GenerateStats } from "@/components/generate/generate-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";
import { destinations } from "@/lib/constants";
import Image from "next/image";
import { Settings2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { z } from "zod";

interface ConfigField {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  validation?: z.ZodType<any>;
}

interface DestinationConfig {
  name: string;
  fields: ConfigField[];
  validation: z.ZodObject<any>;
}

const destinationConfigs: Record<string, DestinationConfig> = {
  Tinybird: {
    name: "Tinybird",
    fields: [
      {
        id: "token",
        label: "API Token",
        required: true,
        validation: z.string().min(1, "API Token is required"),
      },
      {
        id: "datasource",
        label: "Datasource Name",
        required: true,
        validation: z.string().min(1, "Datasource Name is required"),
      },
    ],
    validation: z.object({
      token: z.string().min(1, "API Token is required"),
      datasource: z.string().min(1, "Datasource Name is required"),
    }),
  },
  // Add other destinations here
};

export default function GeneratePage() {
  const [destination, setDestination] = useQueryState("destination");
  const [config, setConfig] = useQueryState("config", {
    parse: (value: string) => JSON.parse(value),
    serialize: (value: object) => JSON.stringify(value),
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedConfig = destination ? destinationConfigs[destination] : null;

  const handleConfigSave = () => {
    if (!selectedConfig) return;

    try {
      // Validate all fields
      const validatedData = selectedConfig.validation.parse(formData);
      setConfig(validatedData);
      setFormErrors({});
      setIsDrawerOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrors(errors);
      }
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Destination</Label>
          <Select value={destination || ""} onValueChange={setDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Select a destination">
                {destination && (
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/destinations/${destination.toLowerCase()}.svg`}
                      alt={destination}
                      width={20}
                      height={20}
                    />
                    <span>{destination}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {destinations.map((dest) => (
                <SelectItem
                  key={dest.generator}
                  value={dest.generator}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={`/destinations/${dest.generator.toLowerCase()}.svg`}
                    alt={dest.title}
                    width={20}
                    height={20}
                    className="inline mr-2"
                  />
                  <span>{dest.title}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={() => setIsDrawerOpen(true)}
            disabled={!destination}
            className="w-full"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      <GenerateStats />

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Configure {selectedConfig?.name}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {selectedConfig?.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Input
                  id={field.id}
                  type={field.type || "text"}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={formErrors[field.id] ? "border-red-500" : ""}
                />
                {formErrors[field.id] && (
                  <p className="text-sm text-red-500">{formErrors[field.id]}</p>
                )}
              </div>
            ))}
          </div>
          <DrawerFooter>
            <Button onClick={handleConfigSave}>Save Configuration</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
